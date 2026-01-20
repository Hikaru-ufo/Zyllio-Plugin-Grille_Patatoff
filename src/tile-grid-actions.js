/// <reference types="@zyllio/zy-sdk" />

/**
 * Actions complémentaires pour le plugin Grille de Tuiles
 * Ces actions peuvent être utilisées avec le composant tile-grid
 */

// ============================================
// ACTION 1: Gestionnaire de sélection de tuiles
// ============================================

class TileSelectionAction {
    constructor() {
        this.selectedTiles = [];
    }

    async execute(properties) {
        try {
            // Récupérer les paramètres de l'action
            const tileData = properties.find(p => p.id === 'tileData');
            const actionType = properties.find(p => p.id === 'actionType')?.value || 'single';
            
            if (!tileData || !tileData.value) {
                throw new Error('Aucune donnée de tuile reçue');
            }

            const tile = JSON.parse(tileData.value);
            
            // Traiter selon le type d'action
            switch (actionType) {
                case 'single':
                    await this.handleSingleSelection(tile);
                    break;
                case 'multiple':
                    await this.handleMultipleSelection(tile);
                    break;
                case 'navigate':
                    await this.handleNavigation(tile);
                    break;
                case 'update':
                    await this.handleDataUpdate(tile);
                    break;
                default:
                    console.log('Type d\'action non reconnu:', actionType);
            }
            
        } catch (error) {
            console.error('Erreur dans TileSelectionAction:', error);
            zySdk.services.dialog.show({
                text: `Erreur: ${error.message}`,
                title: 'Erreur de sélection'
            });
        }
    }

    async handleSingleSelection(tile) {
        // Enregistrer la sélection unique
        this.selectedTiles = [tile.tileId];
        
        // Stocker dans le dictionnaire Zyllio
        zySdk.services.dictionary.set('selectedTile', JSON.stringify(tile));
        zySdk.services.dictionary.set('selectedTileId', tile.tileId);
        
        // Afficher une confirmation
        zySdk.services.dialog.show({
            text: `Tuile "${tile.tileData?.title || tile.tileId}" sélectionnée`,
            title: 'Sélection'
        });
    }

    async handleMultipleSelection(tile) {
        // Ajouter ou retirer de la sélection multiple
        const index = this.selectedTiles.findIndex(t => t === tile.tileId);
        
        if (index > -1) {
            this.selectedTiles.splice(index, 1);
        } else {
            this.selectedTiles.push(tile.tileId);
        }
        
        // Mettre à jour le dictionnaire
        zySdk.services.dictionary.set('selectedTiles', JSON.stringify(this.selectedTiles));
        zySdk.services.dictionary.set('selectedCount', this.selectedTiles.length.toString());
        
        // Afficher le compte
        zySdk.services.dialog.show({
            text: `${this.selectedTiles.length} tuile(s) sélectionnée(s)`,
            title: 'Sélection multiple'
        });
    }

    async handleNavigation(tile) {
        // Navigation vers un autre écran avec les données de la tuile
        if (tile.tileData?.screenId) {
            zySdk.services.navigation.navigate(tile.tileData.screenId, {
                tileId: tile.tileId,
                tileData: tile.tileData
            });
        } else {
            console.log('Pas d\'écran de destination défini');
        }
    }

    async handleDataUpdate(tile) {
        // Mettre à jour les données dans la table
        if (tile.tileData?.tableId && tile.tileId) {
            try {
                await zySdk.services.storage.updateRow(
                    tile.tileData.tableId,
                    tile.tileId,
                    {
                        lastClicked: new Date().toISOString(),
                        clickCount: (tile.tileData.clickCount || 0) + 1
                    }
                );
                
                zySdk.services.dialog.show({
                    text: 'Données mises à jour',
                    title: 'Succès'
                });
            } catch (error) {
                console.error('Erreur de mise à jour:', error);
            }
        }
    }
}

// Métadonnées de l'action de sélection
const TileSelectionActionMetadata = {
    id: 'tile-selection-action',
    name: 'Gestion de sélection de tuiles',
    category: 'Data',
    description: 'Gère les interactions avec les tuiles sélectionnées',
    properties: [
        {
            id: 'tileData',
            name: 'Données de la tuile',
            type: 'text',
            description: 'Données JSON de la tuile cliquée',
            required: true
        },
        {
            id: 'actionType',
            name: 'Type d\'action',
            type: 'select',
            description: 'Type d\'action à effectuer',
            default: 'single',
            values: [
                { value: 'single', label: 'Sélection unique' },
                { value: 'multiple', label: 'Sélection multiple' },
                { value: 'navigate', label: 'Navigation' },
                { value: 'update', label: 'Mise à jour des données' }
            ]
        }
    ]
};

// ============================================
// ACTION 2: Export des tuiles sélectionnées
// ============================================

class TileExportAction {
    async execute(properties) {
        try {
            const exportFormat = properties.find(p => p.id === 'format')?.value || 'json';
            const selectedTiles = zySdk.services.dictionary.get('selectedTiles');
            
            if (!selectedTiles) {
                throw new Error('Aucune tuile sélectionnée à exporter');
            }
            
            const tiles = JSON.parse(selectedTiles);
            
            switch (exportFormat) {
                case 'json':
                    await this.exportAsJSON(tiles);
                    break;
                case 'csv':
                    await this.exportAsCSV(tiles);
                    break;
                case 'email':
                    await this.sendByEmail(tiles);
                    break;
            }
            
        } catch (error) {
            console.error('Erreur d\'export:', error);
            zySdk.services.dialog.show({
                text: `Erreur d'export: ${error.message}`,
                title: 'Erreur'
            });
        }
    }

    async exportAsJSON(tiles) {
        const jsonData = JSON.stringify(tiles, null, 2);
        
        // Créer un blob et télécharger
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiles_export_${Date.now()}.json`;
        a.click();
        
        zySdk.services.dialog.show({
            text: `${tiles.length} tuile(s) exportée(s) en JSON`,
            title: 'Export réussi'
        });
    }

    async exportAsCSV(tiles) {
        // Conversion simplifiée en CSV
        let csv = 'ID,Title,Content\n';
        tiles.forEach(tile => {
            csv += `"${tile.id}","${tile.title || ''}","${tile.content || ''}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tiles_export_${Date.now()}.csv`;
        a.click();
        
        zySdk.services.dialog.show({
            text: `${tiles.length} tuile(s) exportée(s) en CSV`,
            title: 'Export réussi'
        });
    }

    async sendByEmail(tiles) {
        // Préparer le contenu pour l'email
        const emailContent = tiles.map(t => `- ${t.title}: ${t.content}`).join('\n');
        
        // Utiliser l'API Zyllio pour envoyer l'email si disponible
        if (zySdk.services.email) {
            await zySdk.services.email.send({
                subject: 'Export des tuiles sélectionnées',
                body: emailContent,
                to: zySdk.services.dictionary.get('userEmail')
            });
        }
        
        zySdk.services.dialog.show({
            text: 'Email envoyé avec succès',
            title: 'Export par email'
        });
    }
}

// Métadonnées de l'action d'export
const TileExportActionMetadata = {
    id: 'tile-export-action',
    name: 'Export des tuiles',
    category: 'Data',
    description: 'Exporte les tuiles sélectionnées dans différents formats',
    properties: [
        {
            id: 'format',
            name: 'Format d\'export',
            type: 'select',
            description: 'Format de sortie pour l\'export',
            default: 'json',
            values: [
                { value: 'json', label: 'JSON' },
                { value: 'csv', label: 'CSV' },
                { value: 'email', label: 'Email' }
            ]
        }
    ]
};

// ============================================
// ACTION 3: Filtre et recherche de tuiles
// ============================================

class TileFilterAction {
    async execute(properties) {
        try {
            const filterType = properties.find(p => p.id === 'filterType')?.value || 'text';
            const filterValue = properties.find(p => p.id === 'filterValue')?.value;
            const tableId = properties.find(p => p.id === 'tableId')?.value;
            
            if (!filterValue || !tableId) {
                throw new Error('Paramètres de filtre manquants');
            }
            
            // Récupérer les données de la table
            const rows = await zySdk.services.storage.retrieveRows(tableId);
            
            // Appliquer le filtre
            let filteredRows;
            switch (filterType) {
                case 'text':
                    filteredRows = rows.filter(row => 
                        row.fields.title?.toLowerCase().includes(filterValue.toLowerCase()) ||
                        row.fields.content?.toLowerCase().includes(filterValue.toLowerCase())
                    );
                    break;
                case 'date':
                    filteredRows = this.filterByDate(rows, filterValue);
                    break;
                case 'category':
                    filteredRows = rows.filter(row => 
                        row.fields.category === filterValue
                    );
                    break;
            }
            
            // Stocker les résultats filtrés
            zySdk.services.dictionary.set('filteredTiles', JSON.stringify(filteredRows));
            zySdk.services.dictionary.set('filterActive', 'true');
            
            zySdk.services.dialog.show({
                text: `${filteredRows.length} résultat(s) trouvé(s)`,
                title: 'Filtre appliqué'
            });
            
        } catch (error) {
            console.error('Erreur de filtrage:', error);
            zySdk.services.dialog.show({
                text: `Erreur: ${error.message}`,
                title: 'Erreur de filtre'
            });
        }
    }

    filterByDate(rows, dateFilter) {
        const filterDate = new Date(dateFilter);
        return rows.filter(row => {
            if (row.fields.date) {
                const rowDate = new Date(row.fields.date);
                return rowDate >= filterDate;
            }
            return false;
        });
    }
}

// Métadonnées de l'action de filtre
const TileFilterActionMetadata = {
    id: 'tile-filter-action',
    name: 'Filtre de tuiles',
    category: 'Data',
    description: 'Filtre les tuiles selon différents critères',
    properties: [
        {
            id: 'tableId',
            name: 'Table source',
            type: 'table',
            description: 'Table contenant les tuiles',
            required: true
        },
        {
            id: 'filterType',
            name: 'Type de filtre',
            type: 'select',
            description: 'Critère de filtrage',
            default: 'text',
            values: [
                { value: 'text', label: 'Recherche textuelle' },
                { value: 'date', label: 'Date' },
                { value: 'category', label: 'Catégorie' }
            ]
        },
        {
            id: 'filterValue',
            name: 'Valeur du filtre',
            type: 'text',
            description: 'Valeur à rechercher',
            required: true
        }
    ]
};

// ============================================
// ENREGISTREMENT DES ACTIONS
// ============================================

if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
    // Enregistrer l'action de sélection
    const selectionAction = new TileSelectionAction();
    zySdk.services.registry.registerAction(TileSelectionActionMetadata, selectionAction);
    
    // Enregistrer l'action d'export
    const exportAction = new TileExportAction();
    zySdk.services.registry.registerAction(TileExportActionMetadata, exportAction);
    
    // Enregistrer l'action de filtre
    const filterAction = new TileFilterAction();
    zySdk.services.registry.registerAction(TileFilterActionMetadata, filterAction);
    
    console.log('Actions complémentaires pour Grille de Tuiles enregistrées avec succès');
}