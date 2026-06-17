# 09 — Mapping formulaire d'inscription (Google Form → plateforme)

> Référence : formulaire Google ATCCR d'inscription. Ce document mappe les champs du
> formulaire vers les modules plateforme par phase. Aucune donnée participant réelle
> n'est utilisée ; seules les **catégories de configuration congrès** sont implémentées.

## Statut par phase

| Phase | Périmètre | Statut |
|-------|-----------|--------|
| D5 / D5.1 | Catégories de billets, tarifs, options hébergement/transport (config admin) | Implémenté |
| D6 | Formulaire d'inscription publique participant (identité, catégorie, options, consentement) | Implémenté |
| D6.1 / D7 | Justificatif interne/étudiant, paiement, bon de commande | Futur |
| Ultérieur | Coordination hébergement/transport avec agence partenaire | Futur |

---

## D5 / D5.1 — Catégories, tarifs, options (implémenté)

### Catégories d'inscription et tarifs (`TicketType`)

| nameFr | nameEn | price | currency | active |
|--------|--------|-------|----------|--------|
| Médecin spécialiste | Specialist physician | 400 | TND | true |
| Résident | Resident | 200 | TND | true |
| Technicien supérieur | Senior technician | 100 | TND | true |
| Biologiste / Doctorant | Biologist / PhD candidate | 200 | TND | true |
| Interne / étudiant | Intern / student | 0 | TND | true |

> **Interne / étudiant** : tarif gratuit. Un justificatif sera demandé ultérieurement
> lors de l'inscription publique (D6/D7). Aucun upload n'est implémenté en D5.1.

### Options hébergement / transport (`TicketOption`)

| nameFr | nameEn |
|--------|--------|
| Chambre double (LPD) | Double room (bed & breakfast) |
| Chambre single (LPD) | Single room (bed & breakfast) |
| Déplacement par Bus Depuis Tunis / Sousse / Sfax vers Djerba | Bus transfer from Tunis / Sousse / Sfax to Djerba |
| Déplacement Vol Interne Depuis Tunis Vers Djerba | Domestic flight transfer from Tunis to Djerba |

**Prix** : `0` (le champ `TicketOption.price` est requis et non nullable). La tarification
réelle est gérée plus tard par l'agence partenaire, qui contacte directement les
participants. Aucune logique de réservation ou de paiement n'est implémentée.

#### Limitation de schéma documentée

Le modèle `TicketOption` est rattaché à un `TicketType` unique (`ticketTypeId`), il
n'existe pas de modèle d'option globale dans le schéma actuel. Les options
hébergement/transport étant communes à toutes les catégories, elles sont
**dupliquées sur chaque `TicketType`** (4 options × 5 catégories = 20 enregistrements).
C'est l'approche la moins risquée sans modification de schéma. Une consolidation
(modèle d'option global) pourra être envisagée dans une phase ultérieure si nécessaire.

---

## D6 — Inscription publique participant (implémenté)

Champs du formulaire Google implémentés :

| Champ Google | Stockage |
|--------------|----------|
| email | `User.email` |
| nom & prénom | `UserProfile.firstName` + `UserProfile.lastName` (découpage formulaire) |
| spécialité | `UserProfile.specialty` |
| établissement | `UserProfile.institution` |
| téléphone | `UserProfile.phone` |
| catégorie / tarif | `Registration.ticketTypeId` → `TicketType` ; montants snapshot |
| options hébergement/transport | `RegistrationOption` → `TicketOption` (multi-sélection) |
| consentement / CGU | `Registration.consentAt`, `termsAcceptedAt` |

Comportement :

- Création `User` sans mot de passe (`passwordHash` null), sans session Auth.js.
- Rôle `participant` via `UserRole`.
- Statut initial `Registration.status = pending`.
- `paymentStatus = not_paid` (tarif > 0) ou `exempted` (Interne/étudiant 0 TND).
- Confirmation écran + `ConsoleMailer` (pas d'e-mail réel).
- Doublon bloqué : même e-mail + même congrès.

### Reporté (D6.1 / D7)

- justificatif interne/étudiant (upload)
- méthode de paiement
- justificatif de paiement
- bon de commande / prise en charge institutionnelle

---

## D7 — Paiement et justificatifs (futur)

- méthode de paiement : chèque, virement, sur place, autre
- justificatif de paiement (payment proof upload)
- bon de commande / purchase order
- établissement émetteur du bon de commande

> Aucune logique de paiement, d'upload ou de bon de commande n'est implémentée
> avant D7.

---

## Ultérieur — Hébergement / transport

Coordination des options hébergement et transport avec l'agence partenaire
(réservation, tarification, contact participant). Hors périmètre des phases actuelles.
