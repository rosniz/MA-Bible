#!/bin/bash

echo "🚀 Installation de Bible Study App..."
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ avant de continuer."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances npm..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""
echo "✅ Installation terminée avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo ""
echo "1. Assurez-vous que le backend Django est en cours d'exécution sur http://localhost:8000"
echo ""
echo "2. Lancez l'application en mode développement:"
echo "   npm run dev"
echo ""
echo "3. Ouvrez votre navigateur sur http://localhost:3000"
echo ""
echo "Pour plus d'informations, consultez le README.md"
echo ""
echo "🙏 Bon voyage spirituel!"
