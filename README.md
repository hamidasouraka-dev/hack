# ArnaqueDetect AI 🛡️

**La ligne de défense souveraine contre la cybercriminalité en Afrique de l'Ouest.**

ArnaqueDetect est une application de pointe conçue pour protéger les citoyens et les entreprises des tentatives de fraude numérique de plus en plus sophistiquées. Grâce à une intelligence artificielle spécialisée dans le contexte local (Afrique de l'Ouest), l'application identifie instantanément les arnaques dans les messages textes, les images et les offres d'emploi.

## ✨ Fonctionnalités Clés

- **Analyse Multimodale** : Collez un message suspect ou téléchargez une capture d'écran (SMS, WhatsApp, Email).
- **Détection Contextuelle** : Expert en arnaques locales (Mobile Money, virement erroné, faux frais de dossier, etc.).
- **Score de Risque Dynamique** : Une évaluation précise du danger de 0 à 100 avec un diagnostic clair.
- **Rapports Détaillés** : Comprenez *pourquoi* un message est suspect grâce aux indices relevés par l'IA.
- **Assistant de Sécurité Interactif** : Posez des questions supplémentaires sur l'analyse pour lever vos derniers doutes.
- **Interface Premium** : Design minimaliste et rassurant inspiré des standards fintech mondiaux.

## 🚀 Technologie

- **Framework** : React 19 + TypeScript
- **Styling** : Tailwind CSS (Design System sur mesure)
- **Animations** : Framer Motion (animations de luxe et micro-interactions)
- **IA** : Google Gemini (Modèles Flash de dernière génération)
- **Icons** : Lucide React

## 🛠️ Configuration

L'application nécessite une clé API Gemini pour fonctionner.

1.  Assurez-vous d'avoir accès à une clé Google AI Studio.
2.  Configurez la variable d'environnement `GEMINI_API_KEY`.

## 📂 Structure du Projet

```text
/src
  /components
    /analyzer    # Composant d'entrée (texte/image)
    /features    # Cartes de présentation
    /layout      # Navigation, Hero, Footer
    /results     # Affichage du diagnostic et chat assistant
  /services      # Logique de communication avec l'IA
  /types         # Schémas de données TypeScript
```

## 🔐 Confidentialité

ArnaqueDetect respecte votre vie privée. Les analyses sont effectuées sans stockage persistant de vos messages personnels. Seul le diagnostic est généré pour vous aider à prendre une décision éclairée.

---

*Développé avec passion pour sécuriser l'écosystème numérique africain.*
