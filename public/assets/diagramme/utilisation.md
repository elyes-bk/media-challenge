```mermaid
---
title: Diagramme de cas d'utilisation - Application Simplifiée
---

%%{ init: { "theme": "default" } }%%
graph TD

    Utilisateur[Acteur : Utilisateur]
    Admin[Acteur : Admin]

    subgraph Cas d'utilisation - Utilisateur
        Sinscrire[S'inscrire]
        SeConnecter[Se connecter]
        ModifierProfil[Modifier profil]
        ChangerTheme[Changer thème]
        ConsulterEvenements[Consulter événements]
        RegarderVideos[Regarder vidéos]
    end

    subgraph Cas d'utilisation - Admin
        AjouterVideo[Ajouter vidéo]
        ModifierVideo[Modifier vidéo]
        SupprimerVideo[Supprimer vidéo]
        AjouterEvenement[Ajouter événement]
        ModifierEvenement[Modifier événement]
        SupprimerEvenement[Supprimer événement]
    end

    Utilisateur --> Sinscrire
    Utilisateur --> SeConnecter
    Utilisateur --> ModifierProfil
    Utilisateur --> ChangerTheme
    Utilisateur --> ConsulterEvenements
    Utilisateur --> RegarderVideos

    Admin --> SeConnecter
    Admin --> AjouterVideo
    Admin --> ModifierVideo
    Admin --> SupprimerVideo
    Admin --> AjouterEvenement
    Admin --> ModifierEvenement
    Admin --> SupprimerEvenement




```