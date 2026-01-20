# Plugin Grille de Tuiles pour Zyllio

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/zyllio-plugin-tile-grid/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Zyllio Compatible](https://img.shields.io/badge/Zyllio-Compatible-orange.svg)](https://zyllio.com)
[![No-Code](https://img.shields.io/badge/No--Code-Ready-purple.svg)](https://docs.zyllio.com)

## 📋 Description

Plugin professionnel pour Zyllio permettant d'afficher les données sous forme de grille de tuiles interactives. Idéal pour créer des catalogues, tableaux de bord, galeries et interfaces de sélection visuelles dans vos applications no-code.

## Fonctionnalités

✅ **Affichage flexible**
- Affichage des données sous forme de tuiles responsives
- Support de 3 modes : texte seul, image seule, ou combiné
- Grille auto-adaptative selon la taille de l'écran

✅ **Personnalisation visuelle**
- Titre personnalisable pour chaque tuile
- Couleur de feedback configurable
- Durée d'animation ajustable
- Nombre de colonnes paramétrable

✅ **Interactions avancées**
- Clic sur les tuiles avec feedback visuel
- Changement de couleur temporaire au clic
- Déclenchement d'actions Zyllio
- Support de la sélection multiple

## Installation

### 📦 Méthode 1: Installation depuis GitHub (Recommandée)

```bash
# Cloner le repository
git clone https://github.com/your-username/zyllio-plugin-tile-grid.git

# Accéder au dossier
cd zyllio-plugin-tile-grid

# Installer les dépendances (pour le développement)
npm install
```

### 🔗 Méthode 2: Installation directe dans Zyllio

1. **Télécharger le plugin depuis GitHub**
   ```
   https://raw.githubusercontent.com/your-username/zyllio-plugin-tile-grid/main/tile-grid-plugin.js
   ```

2. **Installer dans Zyllio Studio**
   - Ouvrez Zyllio Studio
   - Allez dans Designer > Plugins
   - Cliquez sur "Ajouter un plugin"
   - Sélectionnez le fichier téléchargé
   - Cliquez sur "RELOAD PLUGINS"

### 🚀 Méthode 3: Installation rapide avec script

### Prérequis
- Zyllio Studio installé
- Accès au panneau Designer/Plugins
- Node.js 18+ (pour le développement uniquement)

### Étapes d'installation

1. **Télécharger le plugin**
   - Téléchargez le fichier `tile-grid-plugin.js`

2. **Installer dans Zyllio Studio**
   - Ouvrez Zyllio Studio
   - Allez dans Designer > Plugins
   - Cliquez sur "Ajouter un plugin"
   - Sélectionnez le fichier `tile-grid-plugin.js`

3. **Recharger les plugins**
   - Cliquez sur le bouton "RELOAD PLUGINS"
   - Le composant apparaîtra dans la section Plugins

## Utilisation

### Configuration de base

1. **Ajouter le composant**
   - Dans l'éditeur d'écran, trouvez "Grille de Tuiles" dans la section Plugins
   - Glissez-déposez le composant sur votre écran

2. **Configurer la source de données**
   - Sélectionnez une table comme source de données
   - La table doit contenir au minimum :
     - Un champ `title` ou `name` pour le titre
     - Un champ `content` ou `description` pour le contenu
     - Un champ `imageUrl` ou `image` pour les images (optionnel)

3. **Personnaliser l'affichage**
   - Mode d'affichage : Texte, Image, ou Les deux
   - Nombre de colonnes : Auto ou fixe (2-6)
   - Hauteur des tuiles : Petite à Très grande

### Configuration avancée

#### Actions au clic
```javascript
// Dans votre action Zyllio, vous recevrez :
{
  tileId: "id_de_la_tuile",
  tileData: { /* données complètes de la tuile */ },
  selectedTiles: ["id1", "id2", /* ... */]
}
```

#### Structure de données recommandée
```json
{
  "title": "Titre de la tuile",
  "content": "Description ou contenu textuel",
  "imageUrl": "https://exemple.com/image.jpg",
  "customField1": "valeur1",
  "customField2": "valeur2"
}
```

## Propriétés du composant

| Propriété | Type | Description | Valeur par défaut |
|-----------|------|-------------|-------------------|
| `table` | Table | Source de données | Requis |
| `displayMode` | Select | Mode d'affichage (text/image/both) | text |
| `clickAction` | Action | Action à exécuter au clic | - |
| `feedbackDuration` | Number | Durée du feedback (ms) | 500 |
| `feedbackColor` | Color | Couleur du feedback | #4CAF50 |
| `columns` | Select | Nombre de colonnes | auto |
| `tileHeight` | Select | Hauteur des tuiles | medium |

## Styles personnalisables

- **Largeur** : Largeur du composant
- **Hauteur** : Hauteur totale du conteneur
- **Couleur de fond** : Arrière-plan de la grille
- **Arrondi des coins** : Rayon des bordures

## Événements

Le composant émet un événement `tileClick` avec les détails suivants :
```javascript
{
  tile: {
    id: "...",
    title: "...",
    content: "...",
    data: { /* toutes les données */ }
  },
  selected: true/false,
  allSelected: ["id1", "id2", /* ... */]
}
```

## Exemples d'utilisation

### Catalogue de produits
- Mode : Image et texte
- Action : Ajouter au panier
- Feedback : Couleur verte

### Tableau de bord
- Mode : Texte uniquement
- Action : Naviguer vers détails
- Colonnes : 4

### Galerie d'images
- Mode : Image uniquement
- Action : Ouvrir en plein écran
- Colonnes : Auto

## Support et contribution

Pour toute question ou suggestion :
- Email : contact@zyllio.com
- Documentation : https://docs.zyllio.com

## Changelog

### Version 1.0.0 (2024)
- Version initiale
- Support des 3 modes d'affichage
- Actions et feedback configurables
- Design responsive
- Support de la sélection multiple

## Licence

Ce plugin est fourni sous licence MIT pour utilisation avec Zyllio.

---

Développé avec ❤️ pour la communauté Zyllio