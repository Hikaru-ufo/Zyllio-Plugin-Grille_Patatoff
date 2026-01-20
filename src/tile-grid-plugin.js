/// <reference types="@zyllio/zy-sdk" />

/**
 * Plugin Zyllio - Grille de Tuiles Interactive
 * Affichage de données sous forme de tuiles avec actions et feedback visuel
 * @author Claude Assistant
 * @version 1.0.0
 */

(function() {
    'use strict';

    // Classe du composant TileGrid
    class TileGridComponent extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.tiles = [];
            this.selectedTiles = new Set();
        }

        connectedCallback() {
            this.render();
            this.loadData();
        }

        async loadData() {
            try {
                // Récupération de la propriété table
                const tableProperty = zySdk.services.component.getPropertyValue(this, 'table');
                const displayMode = zySdk.services.component.getPropertyValue(this, 'displayMode') || 'text';
                const clickAction = zySdk.services.component.getPropertyValue(this, 'clickAction');
                const feedbackDuration = zySdk.services.component.getPropertyValue(this, 'feedbackDuration') || 500;
                const feedbackColor = zySdk.services.component.getPropertyValue(this, 'feedbackColor') || '#4CAF50';
                
                if (tableProperty && tableProperty.tableId) {
                    // Récupération des données de la table
                    const listData = await zySdk.services.list.retrieveData(tableProperty);
                    
                    if (listData && listData.items) {
                        this.tiles = listData.items.map(item => ({
                            id: item.id,
                            title: item.fields?.title || item.fields?.name || `Tuile ${item.id}`,
                            content: item.fields?.content || item.fields?.description || '',
                            imageUrl: item.fields?.imageUrl || item.fields?.image || null,
                            data: item.fields
                        }));
                        
                        this.renderTiles(displayMode, clickAction, feedbackDuration, feedbackColor);
                    }
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                zySdk.services.dialog.show({
                    text: `Erreur lors du chargement des données: ${error.message}`,
                    title: 'Erreur'
                });
            }
        }

        render() {
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    display: block;
                    padding: 16px;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    overflow: auto;
                }

                .tile-grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                    width: 100%;
                }

                .tile {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    min-height: 150px;
                    display: flex;
                    flex-direction: column;
                }

                .tile:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                }

                .tile.clicked {
                    animation: tileClick 0.5s ease;
                }

                @keyframes tileClick {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(0.95);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                .tile-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 12px;
                    line-height: 1.3;
                }

                .tile-content {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tile-text {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.5;
                    text-align: center;
                }

                .tile-image {
                    width: 100%;
                    height: 120px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .tile-feedback {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent;
                    pointer-events: none;
                    border-radius: 12px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .tile-feedback.active {
                    opacity: 0.3;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: #999;
                }

                /* Styles responsifs */
                @media (max-width: 768px) {
                    .tile-grid-container {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 12px;
                    }
                    
                    .tile {
                        padding: 12px;
                        min-height: 120px;
                    }
                    
                    .tile-title {
                        font-size: 16px;
                    }
                }
            `;

            this.shadowRoot.appendChild(style);
            
            const container = document.createElement('div');
            container.className = 'tile-grid-container';
            container.innerHTML = '<div class="empty-state">Chargement des tuiles...</div>';
            
            this.shadowRoot.appendChild(container);
        }

        renderTiles(displayMode, clickAction, feedbackDuration, feedbackColor) {
            const container = this.shadowRoot.querySelector('.tile-grid-container');
            
            if (this.tiles.length === 0) {
                container.innerHTML = '<div class="empty-state">Aucune donnée à afficher</div>';
                return;
            }

            container.innerHTML = '';

            this.tiles.forEach(tile => {
                const tileElement = document.createElement('div');
                tileElement.className = 'tile';
                tileElement.dataset.tileId = tile.id;

                // Titre de la tuile
                const titleElement = document.createElement('div');
                titleElement.className = 'tile-title';
                titleElement.textContent = tile.title;
                tileElement.appendChild(titleElement);

                // Contenu de la tuile (image ou texte)
                const contentElement = document.createElement('div');
                contentElement.className = 'tile-content';

                if (displayMode === 'image' && tile.imageUrl) {
                    const img = document.createElement('img');
                    img.className = 'tile-image';
                    img.src = tile.imageUrl;
                    img.alt = tile.title;
                    img.onerror = () => {
                        // Si l'image ne charge pas, afficher le texte à la place
                        contentElement.innerHTML = `<div class="tile-text">${tile.content || 'Image non disponible'}</div>`;
                    };
                    contentElement.appendChild(img);
                } else if (displayMode === 'both' && tile.imageUrl) {
                    // Mode mixte : image + texte
                    const img = document.createElement('img');
                    img.className = 'tile-image';
                    img.src = tile.imageUrl;
                    img.alt = tile.title;
                    img.style.marginBottom = '8px';
                    contentElement.appendChild(img);
                    
                    if (tile.content) {
                        const textDiv = document.createElement('div');
                        textDiv.className = 'tile-text';
                        textDiv.textContent = tile.content;
                        contentElement.appendChild(textDiv);
                    }
                } else {
                    // Mode texte par défaut
                    const textDiv = document.createElement('div');
                    textDiv.className = 'tile-text';
                    textDiv.textContent = tile.content || 'Contenu vide';
                    contentElement.appendChild(textDiv);
                }

                tileElement.appendChild(contentElement);

                // Élément de feedback visuel
                const feedbackElement = document.createElement('div');
                feedbackElement.className = 'tile-feedback';
                feedbackElement.style.backgroundColor = feedbackColor;
                tileElement.appendChild(feedbackElement);

                // Gestionnaire de clic
                tileElement.addEventListener('click', async () => {
                    await this.handleTileClick(tile, tileElement, feedbackElement, clickAction, feedbackDuration);
                });

                container.appendChild(tileElement);
            });
        }

        async handleTileClick(tile, tileElement, feedbackElement, clickAction, feedbackDuration) {
            // Animation de feedback visuel
            tileElement.classList.add('clicked');
            feedbackElement.classList.add('active');

            // Retirer les classes après la durée spécifiée
            setTimeout(() => {
                tileElement.classList.remove('clicked');
                feedbackElement.classList.remove('active');
            }, feedbackDuration);

            // Gérer la sélection
            if (this.selectedTiles.has(tile.id)) {
                this.selectedTiles.delete(tile.id);
            } else {
                this.selectedTiles.add(tile.id);
            }

            // Exécuter l'action configurée
            if (clickAction) {
                try {
                    // Notification à Zyllio de l'événement
                    await this.triggerZyllioAction(clickAction, tile);
                } catch (error) {
                    console.error('Erreur lors de l\'exécution de l\'action:', error);
                }
            }

            // Émettre un événement personnalisé
            this.dispatchEvent(new CustomEvent('tileClick', {
                detail: {
                    tile: tile,
                    selected: this.selectedTiles.has(tile.id),
                    allSelected: Array.from(this.selectedTiles)
                }
            }));
        }

        async triggerZyllioAction(actionId, tile) {
            // Déclencher une action Zyllio
            if (zySdk.services.action) {
                await zySdk.services.action.execute(actionId, {
                    tileId: tile.id,
                    tileData: tile.data,
                    selectedTiles: Array.from(this.selectedTiles)
                });
            }
            
            // Mettre à jour les données de contexte si nécessaire
            if (zySdk.services.dictionary) {
                zySdk.services.dictionary.set('selectedTileId', tile.id);
                zySdk.services.dictionary.set('selectedTileData', JSON.stringify(tile.data));
            }
        }
    }

    // Métadonnées du composant
    const TileGridMetadata = {
        id: 'tile-grid',
        name: 'Grille de Tuiles',
        category: 'Display',
        description: 'Affiche des données sous forme de tuiles interactives avec support image/texte',
        properties: [
            {
                id: 'table',
                name: 'Source de données',
                type: 'table',
                description: 'Table contenant les données à afficher',
                required: true
            },
            {
                id: 'displayMode',
                name: 'Mode d\'affichage',
                type: 'select',
                description: 'Type de contenu à afficher dans les tuiles',
                default: 'text',
                values: [
                    { value: 'text', label: 'Texte uniquement' },
                    { value: 'image', label: 'Image uniquement' },
                    { value: 'both', label: 'Image et texte' }
                ]
            },
            {
                id: 'clickAction',
                name: 'Action au clic',
                type: 'action',
                description: 'Action à exécuter lors du clic sur une tuile',
                required: false
            },
            {
                id: 'feedbackDuration',
                name: 'Durée du feedback (ms)',
                type: 'number',
                description: 'Durée de l\'animation de feedback en millisecondes',
                default: 500,
                min: 100,
                max: 2000
            },
            {
                id: 'feedbackColor',
                name: 'Couleur du feedback',
                type: 'color',
                description: 'Couleur du feedback visuel au clic',
                default: '#4CAF50'
            },
            {
                id: 'columns',
                name: 'Nombre de colonnes',
                type: 'select',
                description: 'Nombre de colonnes sur desktop',
                default: 'auto',
                values: [
                    { value: 'auto', label: 'Automatique' },
                    { value: '2', label: '2 colonnes' },
                    { value: '3', label: '3 colonnes' },
                    { value: '4', label: '4 colonnes' },
                    { value: '5', label: '5 colonnes' },
                    { value: '6', label: '6 colonnes' }
                ]
            },
            {
                id: 'tileHeight',
                name: 'Hauteur des tuiles',
                type: 'select',
                description: 'Hauteur minimale des tuiles',
                default: 'medium',
                values: [
                    { value: 'small', label: 'Petite (100px)' },
                    { value: 'medium', label: 'Moyenne (150px)' },
                    { value: 'large', label: 'Grande (200px)' },
                    { value: 'xlarge', label: 'Très grande (250px)' }
                ]
            }
        ],
        styles: [
            {
                id: 'width',
                name: 'Largeur',
                type: 'width',
                default: '100%'
            },
            {
                id: 'height',
                name: 'Hauteur',
                type: 'height',
                default: '400px'
            },
            {
                id: 'background-color',
                name: 'Couleur de fond',
                type: 'background-color',
                default: '#f5f5f5'
            },
            {
                id: 'border-radius',
                name: 'Arrondi des coins',
                type: 'border-radius',
                default: '8px'
            }
        ]
    };

    // Définir le custom element
    customElements.define('tile-grid-component', TileGridComponent);

    // Enregistrer le composant auprès de Zyllio
    if (typeof zySdk !== 'undefined' && zySdk.services && zySdk.services.registry) {
        zySdk.services.registry.registerComponent(TileGridMetadata, TileGridComponent);
    }

})();