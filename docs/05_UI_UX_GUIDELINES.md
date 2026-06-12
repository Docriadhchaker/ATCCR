# 05 — UI / UX Guidelines

> Charte visuelle et ergonomique pour le congrès médical scientifique ATCCR.

## Positionnement visuel

- **Premium médical** : sérieux, institutionnel, moderne.
- **Clair et aéré** : hiérarchie lisible, espaces généreux.
- **Bilingue natif** : français et anglais au même niveau de qualité.
- **Responsive** : desktop prioritaire pour l'admin ; mobile prioritaire pour le scanner staff.

## Ce qu'il faut éviter

- Couleurs enfantines ou néon.
- Illustrations style startup / tech disruptif.
- Vocabulaire incubator dans l'UI (voir `AGENTS.md`).
- Surcharge d'animations.
- Tableaux admin illisibles sur mobile.
- Contraste insuffisant (accessibilité WCAG AA minimum).

## Palette validée

| Token | Valeur | Usage |
|-------|--------|-------|
| `--primary` | `#0F2B5B` | Bleu foncé — header, titres, sidebar admin |
| `--primary-foreground` | `#FFFFFF` | Texte sur primaire |
| `--secondary` | `#0D9488` | Teal — CTA secondaires, accents, liens actifs |
| `--secondary-foreground` | `#FFFFFF` | Texte sur secondaire |
| `--background` | `#FFFFFF` | Fond pages publiques |
| `--muted` | `#F4F6F8` | Fond sections alternées, gris très clair |
| `--muted-foreground` | `#64748B` | Texte secondaire |
| `--border` | `#E2E8F0` | Bordures cartes et tableaux |
| `--accent` | `#E0F2F1` | Teal très clair — hover, badges info |
| `--destructive` | `#DC2626` | Erreurs, refus paiement |
| `--success` | `#16A34A` | Paiement validé, accepté |
| `--warning` | `#D97706` | Pay on-site, alertes |

Les couleurs admin sont surchargeables via `congress_settings` (primary, secondary) — conserver les teintes médicales par défaut.

## Typographie

| Usage | Police | Poids |
|-------|--------|-------|
| Titres | Inter ou Source Sans 3 | 600–700 |
| Corps | Inter | 400 |
| Données / références | JetBrains Mono ou tabular nums | 400 |

Tailles :

- H1 hero : `text-4xl md:text-5xl lg:text-6xl`
- H2 section : `text-2xl md:text-3xl`
- Corps : `text-base` (16px)
- Labels formulaire : `text-sm font-medium`
- Métadonnées : `text-xs text-muted-foreground`

## Composants (shadcn/ui)

Utiliser shadcn/ui comme base. Personnaliser via CSS variables dans `globals.css`.

| Composant | Usage |
|-----------|-------|
| `Button` | CTA hero, actions admin |
| `Card` | Thématiques, intervenants, KPI dashboard |
| `Badge` | Statuts paiement, statuts soumission |
| `Table` | Inscriptions, soumissions |
| `Dialog` / `Sheet` | Détail inscription (modale onglets) |
| `Tabs` | Onglets détail inscription |
| `Form` + `Input` | Tous formulaires |
| `Select` | Filtres, catégories |
| `Toast` | Confirmations actions |
| `Sidebar` | Navigation admin |

## Layout

### Site public

```
┌─────────────────────────────────────┐
│  Header : logo · nav · langue · CTA │
├─────────────────────────────────────┤
│  Hero (titre, sous-titre, 3 CTA)    │
├─────────────────────────────────────┤
│  Sections (cards, timeline)         │
├─────────────────────────────────────┤
│  Footer : contact · liens · langue  │
└─────────────────────────────────────┘
```

- Header sticky, fond blanc ou bleu foncé selon page.
- Hero : image congrès en overlay gradient bleu foncé.
- Cartes : `rounded-xl`, ombre légère `shadow-sm`, bordure `border`.

### Back-office admin

```
┌──────────┬──────────────────────────┐
│ Sidebar  │  Topbar (breadcrumb,     │
│ (dark    │   user menu, locale)     │
│  blue)   ├──────────────────────────┤
│          │  Contenu (fond muted)    │
│          │  Cards KPI + tableaux    │
└──────────┴──────────────────────────┘
```

- Sidebar : fond `#0F2B5B`, liens actifs teal.
- Zone contenu : fond `#F4F6F8`, cartes blanches.
- KPI cards : icône teal, chiffre large, label muted.

### Scanner staff

- Interface minimaliste, plein écran.
- Gros bouton scan, résultat en carte pleine largeur.
- Codes couleur accès : vert = autorisé, orange = avertissement, rouge = refusé.

## Navigation publique (labels spec)

| FR | EN | Route |
|----|-----|-------|
| À propos | About | `/a-propos` |
| Thématiques | Themes | `/thematiques` |
| Programme | Program | `/programme` |
| Intervenants | Speakers | `/intervenants` |
| Partenaires | Partners | `/partenaires` |
| Billetterie | Registration | `/billetterie` |
| Soumission scientifique | Scientific submission | `/soumission-scientifique` |
| Se connecter | Sign in | `/connexion` |
| S'inscrire | Register | `/inscription` |

## CTA hero

1. **S'inscrire** — primaire (teal)
2. **Voir le programme** — outline
3. **Soumettre un travail scientifique** — outline ou lien texte

## Badges de statut

### Paiement (`registration_payment_status`)

| Statut | Couleur | Icône |
|--------|---------|-------|
| Payé (online/manuel) | vert | check |
| En attente | orange | clock |
| Preuve en validation | bleu | upload |
| Preuve rejetée | rouge | x |
| Non payé | gris | minus |
| Sur place | orange | map-pin |
| Remboursé | violet | rotate-ccw |

### Soumission scientifique

| Statut | Couleur |
|--------|---------|
| Brouillon | gris |
| Soumis / En attente | bleu |
| En évaluation | orange |
| Accepté | vert |
| Accepté avec modifications | teal |
| Refusé | rouge |
| Retiré | gris |

## Formulaires

- Labels au-dessus des champs.
- Champs obligatoires marqués `*`.
- Messages d'erreur sous le champ, rouge, texte clair.
- Abstract structuré : 5 zones de texte (Introduction, Objectif, Méthodes, Résultats, Conclusion).
- Consentements : checkboxes explicites (éthique, conflits d'intérêt, anonymisation patient).

## Timeline programme

- Affichage par jour, colonne horaire verticale.
- Filtres : jour, type de session, salle, intervenant, recherche mot-clé.
- Carte session : heure, titre, salle, type (badge), intervenants.
- Bouton « Ajouter à mon agenda » sur chaque session.

## Accessibilité

- Contraste texte ≥ 4.5:1.
- Focus visible sur tous les éléments interactifs.
- `aria-label` sur boutons icône.
- Formulaires : `htmlFor` + `id` associés.
- Images : `alt` descriptif (photo intervenant = nom).

## i18n UI

- Toutes les chaînes via `next-intl` — jamais de texte en dur dans les composants.
- Fichiers : `messages/fr.json`, `messages/en.json`.
- Format dates : `fr` → `dd/MM/yyyy`, `en` → `MMM dd, yyyy`.
- Devises : `1 200,00 TND` (fr) / `€1,200.00` (en).

## Responsive breakpoints

| Breakpoint | Comportement |
|------------|--------------|
| `< 640px` | Navigation hamburger, cartes empilées |
| `640–1024px` | Grille 2 colonnes |
| `> 1024px` | Grille 3–4 colonnes, sidebar admin fixe |

## Impression (badges, attestations)

- Badge : formats A5, A6.
- QR minimum 2 cm × 2 cm.
- Attestation : A4 paysage, marges sécurisées pour tampon et signature.

## Références internes

- Spec produit complète : `PRODUCT_SPEC.md` (sections UI, Design style).
- Tokens Tailwind : `src/app/globals.css` (à créer en Phase 0).
