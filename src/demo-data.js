/**
 * Fichier de démonstration du plugin Grille de Tuiles
 * Ce fichier contient des exemples de données et de configuration
 */

// ============================================
// STRUCTURE DE DONNÉES RECOMMANDÉE
// ============================================

const exempleStructureTable = {
    // Configuration de la table dans Zyllio
    tableName: "Catalogue_Produits",
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
            description: "Titre affiché sur la tuile"
        },
        {
            name: "content",
            type: "text",
            required: false,
            description: "Description ou contenu textuel"
        },
        {
            name: "imageUrl",
            type: "url",
            required: false,
            description: "URL de l'image à afficher"
        },
        {
            name: "category",
            type: "select",
            required: false,
            values: ["Électronique", "Vêtements", "Alimentation", "Maison"]
        },
        {
            name: "price",
            type: "number",
            required: false,
            description: "Prix du produit"
        },
        {
            name: "available",
            type: "boolean",
            required: false,
            default: true
        },
        {
            name: "clickCount",
            type: "number",
            required: false,
            default: 0,
            description: "Nombre de clics sur la tuile"
        },
        {
            name: "lastClicked",
            type: "datetime",
            required: false,
            description: "Date du dernier clic"
        },
        {
            name: "tags",
            type: "tags",
            required: false,
            description: "Tags pour le filtrage"
        },
        {
            name: "customData",
            type: "json",
            required: false,
            description: "Données personnalisées supplémentaires"
        }
    ]
};

// ============================================
// DONNÉES D'EXEMPLE
// ============================================

const donneesExemple = [
    {
        title: "Ordinateur Portable Pro",
        content: "Intel i7, 16GB RAM, SSD 512GB. Parfait pour le télétravail et le développement.",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        category: "Électronique",
        price: 1299.99,
        available: true,
        tags: ["nouveau", "promotion", "bestseller"],
        customData: {
            warranty: "2 ans",
            stock: 15,
            supplier: "TechCorp"
        }
    },
    {
        title: "Smartphone Galaxy",
        content: "Écran 6.5 pouces, 128GB, 5G. Caméra 48MP pour des photos exceptionnelles.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        category: "Électronique",
        price: 899.00,
        available: true,
        tags: ["5G", "android", "photo"],
        customData: {
            color: ["noir", "blanc", "bleu"],
            network: "5G",
            battery: "5000mAh"
        }
    },
    {
        title: "Casque Audio Sans Fil",
        content: "Réduction de bruit active, 30h d'autonomie. Son haute fidélité.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        category: "Électronique",
        price: 249.99,
        available: true,
        tags: ["audio", "bluetooth", "ANC"],
        customData: {
            bluetooth: "5.0",
            weight: "250g",
            colors: ["noir", "argent"]
        }
    },
    {
        title: "Montre Connectée Sport",
        content: "GPS intégré, capteur cardiaque, étanche 50m. Suivi d'activité complet.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        category: "Électronique",
        price: 299.00,
        available: false,
        tags: ["sport", "santé", "GPS"],
        customData: {
            battery_life: "7 jours",
            water_resistance: "5ATM",
            sensors: ["GPS", "Heart Rate", "Accelerometer"]
        }
    },
    {
        title: "Tablette Graphique",
        content: "Écran 13 pouces, 8192 niveaux de pression. Pour artistes et designers.",
        imageUrl: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400",
        category: "Électronique",
        price: 599.99,
        available: true,
        tags: ["créatif", "design", "art"],
        customData: {
            pressure_levels: 8192,
            screen_size: "13 inches",
            compatibility: ["Windows", "Mac", "Linux"]
        }
    },
    {
        title: "Caméra de Sécurité",
        content: "Vision nocturne, détection de mouvement, stockage cloud. Installation facile.",
        imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400",
        category: "Maison",
        price: 149.99,
        available: true,
        tags: ["sécurité", "smart home", "wifi"],
        customData: {
            resolution: "1080p",
            night_vision: true,
            storage: "Cloud + SD Card"
        }
    },
    {
        title: "Robot Aspirateur",
        content: "Navigation intelligente, contrôle app, retour automatique à la base.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        category: "Maison",
        price: 399.00,
        available: true,
        tags: ["smart home", "nettoyage", "automatique"],
        customData: {
            battery: "120 min",
            noise_level: "65dB",
            features: ["App Control", "Voice Control", "Scheduling"]
        }
    },
    {
        title: "Lampe Connectée RGB",
        content: "16 millions de couleurs, contrôle vocal, programmation horaire.",
        imageUrl: "https://images.unsplash.com/photo-1565636192335-6a3d41e763ce?w=400",
        category: "Maison",
        price: 49.99,
        available: true,
        tags: ["éclairage", "smart home", "RGB"],
        customData: {
            colors: "16 million",
            brightness: "800 lumens",
            compatibility: ["Alexa", "Google Home", "Siri"]
        }
    }
];

// ============================================
// CONFIGURATIONS D'AFFICHAGE
// ============================================

const configurationsExemples = {
    // Configuration 1: Catalogue de produits
    catalogueProduits: {
        displayMode: "both",        // Afficher image et texte
        columns: "auto",            // Colonnes automatiques
        tileHeight: "large",        // Tuiles grandes
        feedbackColor: "#2196F3",   // Bleu Material
        feedbackDuration: 600,      // 600ms
        clickAction: "tile-selection-action"
    },

    // Configuration 2: Tableau de bord minimaliste
    tableauDeBord: {
        displayMode: "text",        // Texte uniquement
        columns: "4",              // 4 colonnes fixes
        tileHeight: "small",       // Tuiles petites
        feedbackColor: "#4CAF50",  // Vert
        feedbackDuration: 300,     // Animation rapide
        clickAction: "navigate"
    },

    // Configuration 3: Galerie d'images
    galerieImages: {
        displayMode: "image",       // Images uniquement
        columns: "auto",           // Colonnes auto
        tileHeight: "medium",      // Taille moyenne
        feedbackColor: "#FF5722",  // Orange profond
        feedbackDuration: 800,     // Animation longue
        clickAction: "fullscreen"
    },

    // Configuration 4: Liste de tâches
    listeTaches: {
        displayMode: "text",
        columns: "2",
        tileHeight: "medium",
        feedbackColor: "#9C27B0",  // Violet
        feedbackDuration: 400,
        clickAction: "update-status"
    }
};

// ============================================
// STYLES CSS PERSONNALISÉS
// ============================================

const stylesPersonnalises = `
/* Styles pour thème sombre */
.theme-dark .tile-grid-container {
    background-color: #1a1a1a;
}

.theme-dark .tile {
    background: #2d2d2d;
    color: #ffffff;
}

.theme-dark .tile-title {
    color: #ffffff;
}

.theme-dark .tile-text {
    color: #b0b0b0;
}

/* Styles pour tuiles avec statut */
.tile.status-available {
    border: 2px solid #4CAF50;
}

.tile.status-unavailable {
    border: 2px solid #f44336;
    opacity: 0.7;
}

.tile.status-pending {
    border: 2px solid #FF9800;
}

/* Animation d'entrée */
@keyframes tileEntry {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tile {
    animation: tileEntry 0.5s ease-out;
    animation-fill-mode: both;
}

.tile:nth-child(1) { animation-delay: 0.05s; }
.tile:nth-child(2) { animation-delay: 0.1s; }
.tile:nth-child(3) { animation-delay: 0.15s; }
.tile:nth-child(4) { animation-delay: 0.2s; }
.tile:nth-child(5) { animation-delay: 0.25s; }
.tile:nth-child(6) { animation-delay: 0.3s; }

/* Badges et indicateurs */
.tile-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #ff4444;
    color: white;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: bold;
}

/* Effet de survol amélioré */
.tile:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Mode grille compacte */
.compact-mode .tile {
    padding: 8px;
    min-height: 80px;
}

.compact-mode .tile-title {
    font-size: 14px;
    margin-bottom: 4px;
}

.compact-mode .tile-text {
    font-size: 12px;
}
`;

// ============================================
// SCRIPT D'INITIALISATION
// ============================================

const scriptInitialisation = `
// Script à exécuter lors du chargement de l'écran dans Zyllio

// Initialiser les données d'exemple
async function initDemoData() {
    try {
        // Récupérer l'ID de la table depuis les propriétés
        const tableId = zySdk.services.component.getPropertyValue(this, 'demoTableId');
        
        if (!tableId) {
            console.log('Pas de table de démo configurée');
            return;
        }
        
        // Vérifier si les données existent déjà
        const existingData = await zySdk.services.storage.retrieveRows(tableId);
        
        if (existingData.length === 0) {
            // Insérer les données d'exemple
            for (const item of donneesExemple) {
                await zySdk.services.storage.createRow(tableId, item);
            }
            
            console.log('Données de démonstration créées avec succès');
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
    }
}

// Appeler l'initialisation au chargement
document.addEventListener('DOMContentLoaded', initDemoData);
`;

// ============================================
// EXPORT POUR UTILISATION
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exempleStructureTable,
        donneesExemple,
        configurationsExemples,
        stylesPersonnalises,
        scriptInitialisation
    };
}

// Message de confirmation
console.log('📦 Fichier de démonstration chargé');
console.log('📊 ' + donneesExemple.length + ' exemples de tuiles disponibles');
console.log('🎨 ' + Object.keys(configurationsExemples).length + ' configurations prédéfinies');
console.log('✨ Styles personnalisés et script d\'initialisation prêts à l\'emploi');