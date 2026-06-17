# 10 — Audit architecture paiement (Phase 0, Étape D7.0)

> Document d'audit **lecture seule**. Aucune implémentation de paiement, aucun appel
> API réel (Flouci / ClicToPay), aucune migration, aucun seed. Objectif : préparer
> D7 en s'appuyant sur le schéma et le code existants. Identifiants techniques en
> anglais ; aucune donnée participant ou identifiant réel.

## Contexte

- D6.1 terminé : inscription publique sans paiement / upload / bon de commande.
- Section paiement du Google Form : **chèque**, **virement**, **sur place**, **autre**.
- Bon de commande : oui/non + institution émettrice.
- Fournisseurs en ligne potentiels : **Flouci** (flux redirect), **ClicToPay / Monétique Tunisie** (carte bancaire, kit marchand requis).

---

## 1. Support du schéma de paiement actuel (tables et champs)

### Tableau de correspondance modèle → besoin

| Besoin D7 | Modèle.champ existant | Couvert sans migration |
|-----------|-----------------------|------------------------|
| Paiement manuel | `Payment.method = manual`, `Payment.status`, `Payment.internalComment` | Oui |
| Virement bancaire | `Payment.method = bank_transfer` | Oui |
| Paiement sur place | `Payment.method = on_site` ; `RegistrationPaymentStatus.pay_on_site` | Oui |
| Chèque | `Payment.method = manual` (pas d'enum `cheque`) + `Payment.internalComment` / `providerResponse` | Oui (mappé sur `manual`) |
| Référence fournisseur en ligne | `Payment.provider` (String), `Payment.providerReference` (String) | Oui |
| ID transaction passerelle | `Payment.providerReference` (paiement) + `Payment.providerResponse` (Json, payload complet) | Oui |
| Montant / devise / statut | `Payment.amount` (Decimal 12,2), `Payment.currency` (`Currency`), `Payment.status` (`PaymentRecordStatus`) | Oui |
| Upload de justificatif | `PaymentProof` + `MediaAsset` (`MediaCategory.payment_proof`) + `StoragePort` local | Oui |
| Validation / rejet admin | `Payment.validatedById` / `validatedAt` ; `PaymentProof.status` / `reviewedById` / `reviewedAt` / `rejectionReason` | Oui |
| Historique de statut | `PaymentStatusHistory` (`fromStatus`, `toStatus`, `triggeredById`, `paymentId`, `note`) | Oui |
| Bon de commande (PO) | `Registration.billingInfo` (Json `@default("{}")`) | Oui (sans champ dédié) |
| Journalisation | `AuditLog` (`action`, `entityType`, `entityId`, `metadata`, `actorId`, `ipAddress`) | Oui |

### Détail des champs clés

- **`Payment`** : `method` (`PaymentMethod`), `status` (`PaymentRecordStatus` : `pending/processing/succeeded/failed/cancelled/refunded`), `amount`, `currency`, `provider`, `providerReference`, `providerResponse` (Json), `validatedById`, `validatedAt`, `internalComment`. Contrainte `@@unique([provider, providerReference])` (anti-doublon passerelle).
- **`PaymentProof`** : `paymentId`, `mediaAssetId`, `status` (`ProofStatus`), `reviewedById`, `reviewedAt`, `rejectionReason`. → upload + revue admin entièrement couverts.
- **`PaymentStatusHistory`** : trace chaque transition de `Registration.paymentStatus`, avec acteur, paiement lié et note.
- **`Registration`** : `paymentStatus` (`RegistrationPaymentStatus`), `subtotal`, `vatAmount`, `totalAmount`, `currency` (via `ticketType`), `billingInfo` (Json) → conteneur PO.
- **`MediaAsset`** : `storageKey`, `mimeType`, `sizeBytes`, `category` (`payment_proof`), `linkedEntityType/Id`, `uploadedById` → fichiers stockés via `StoragePort` local.
- **`AuditLog`** : journalisation générique déjà utilisée par D6.

**Conclusion section 1** : le schéma supporte déjà manuel, virement, sur place, chèque (via `manual`), référence/transaction fournisseur, montant/devise/statut, upload de justificatif et validation/rejet admin. **Aucun champ manquant** pour D7.1 ni pour les stubs fournisseurs.

---

## 2. Mapping des méthodes de paiement (Google Form → `PaymentMethod`)

`PaymentMethod` existant : `online`, `bank_transfer`, `manual`, `on_site`, `free`, `exempted`.

| Valeur Google Form | `PaymentMethod` recommandé | Note |
|--------------------|----------------------------|------|
| virement | `bank_transfer` | Correspondance exacte |
| sur place | `on_site` | Correspondance exacte |
| chèque | `manual` | Pas d'enum `cheque` ; conserver le sous-type dans `Payment.internalComment` ou `providerResponse.subMethod = "cheque"` |
| autre | `manual` | Idem ; préciser dans `internalComment` / `providerResponse` |
| (paiement en ligne) | `online` | Flouci / ClicToPay |
| (Interne / étudiant 0 TND) | `free` ou `exempted` | Aucun paiement requis |

**Recommandation** : ne pas ajouter d'enum `cheque`/`other`. Conserver le sous-type via `Payment.providerResponse` (ex. `{ "subMethod": "cheque" }`) ou `internalComment`. **Aucun changement de schéma**.

---

## 3. Statut de paiement de l'inscription

### Catégories payantes (400 / 200 / 100 TND)

État initial D6 : `Registration.paymentStatus = not_paid`.

Transitions D7 recommandées (chaque transition → ligne `PaymentStatusHistory`) :

| Flux | `Payment.status` | `Registration.paymentStatus` |
|------|------------------|------------------------------|
| Choix virement/chèque → justificatif attendu | `pending` | `awaiting_payment` |
| Justificatif déposé, en attente de revue | `pending` | `awaiting_proof_validation` |
| Justificatif accepté (admin) | `succeeded` | `proof_accepted` puis `paid_manually` |
| Justificatif rejeté (admin) | `failed` | `proof_rejected` |
| Sur place | `pending` | `pay_on_site` |
| En ligne réussi (Flouci/ClicToPay) | `succeeded` | `paid_online` |
| Annulé / remboursé | `cancelled` / `refunded` | `cancelled` / `refunded` |

### Catégorie gratuite (Interne / étudiant 0 TND)

- Reste `exempted` (déjà appliqué en D6 pour tarif 0).
- Aucun paiement en ligne requis ; aucun `Payment` à créer.
- Le justificatif interne/étudiant (upload) peut réutiliser `MediaAsset` + un mécanisme de revue ; décision de périmètre D7.1 (justificatif de statut) distincte du justificatif de paiement.

**`RegistrationPaymentStatus`** couvre tous les états ci-dessus (`not_paid`, `awaiting_payment`, `awaiting_proof_validation`, `paid_online`, `paid_manually`, `proof_accepted`, `proof_rejected`, `pay_on_site`, `cancelled`, `refunded`, `free_invited`, `exempted`). **Aucun enum manquant**.

---

## 4. Flux paiement manuel / hors-ligne (périmètre D7.1)

### Périmètre proposé

- Méthodes : virement (`bank_transfer`), chèque (`manual`), sur place (`on_site`).
- Bon de commande (PO) : champ oui/non + institution émettrice, stockés dans `Registration.billingInfo` (Json), p. ex. `{ "purchaseOrder": { "required": true, "institution": "..." } }`.
- Upload de justificatif : `StoragePort.saveFile` (dossier `proofs`) → `MediaAsset` (`category = payment_proof`, `linkedEntityType = "payment"`, `linkedEntityId = payment.id`) → `PaymentProof` (`status = pending`).

### Parcours

1. **Après inscription** (réutilise la confirmation D6.1) : le participant voit sa référence + un écran « instructions de paiement » selon la méthode (RIB pour virement, ordre pour chèque, mention sur place).
2. **Données collectées** : méthode choisie, PO oui/non + institution, fichier justificatif (pour virement/chèque).
3. **Stockage des fichiers** : stockage local via `StoragePort` (clé opaque) ; métadonnées en base via `MediaAsset`. Pas d'exposition directe du chemin disque.
4. **Statut assigné** : `Payment.status = pending` ; `Registration.paymentStatus = awaiting_payment` puis `awaiting_proof_validation` au dépôt du justificatif.
5. **À valider plus tard (admin)** : revue du justificatif (`PaymentProof.status` accepté/rejeté), validation du paiement (`Payment.validatedById/validatedAt`), passage à `paid_manually` / `proof_rejected`, chaque étape tracée dans `PaymentStatusHistory` + `AuditLog`.

> Note RBAC : l'écran de validation admin nécessitera de mapper `finance_manager` (et/ou `registration_manager`) aux permissions `payments.validate`, `payments.proofs.review` dans `src/lib/rbac/permissions.ts` (`ROLE_PERMISSIONS`). Actuellement seules `super_admin` (bypass) et `congress_admin` (sous-ensemble sans paiement) sont mappées. **C'est du code, pas du schéma.**

---

## 5. Architecture fournisseur en ligne (abstraction, sans appel réel)

### Port recommandé (`PaymentProviderPort`)

```ts
interface CreatePaymentSessionInput {
  registrationId: string;
  amount: number;          // mineure ou décimale selon adaptateur
  currency: "TND" | "EUR";
  returnUrl: string;       // succès
  cancelUrl: string;       // échec / annulation
  reference: string;       // Registration.reference
}

interface CreatePaymentSessionResult {
  provider: string;            // "flouci" | "clictopay" | "manual"
  providerPaymentId: string;   // → Payment.providerReference
  redirectUrl: string | null;  // null pour manual
}

interface VerifyPaymentInput {
  providerPaymentId: string;
  providerTransactionId?: string;
}

interface VerifyPaymentResult {
  status: "succeeded" | "failed" | "pending" | "cancelled";
  providerTransactionId?: string;
  rawResponse: unknown;        // → Payment.providerResponse
}

interface HandleWebhookInput {
  rawBody: string;
  headers: Record<string, string>;
  signature?: string;          // placeholder vérification
}

interface PaymentProviderPort {
  createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
  handleWebhook(input: HandleWebhookInput): Promise<VerifyPaymentResult>;
  // refund/cancel : différé tant que non requis fonctionnellement
}
```

### Adaptateurs recommandés

- **`ManualPaymentAdapter`** : `createPaymentSession` retourne `redirectUrl = null` ; pas de webhook. Pleinement implémentable en D7.1.
- **`FlouciPaymentAdapter`** (stub D7.2) : structure le flux redirect, mais retourne un résultat simulé / `NotImplemented` tant que les tokens ne sont pas fournis. Token privé **backend uniquement**.
- **`ClicToPayPaymentAdapter`** (stub D7.2) : structure le flux carte/redirect, en attente du kit marchand. Stub `NotImplemented`.

### Champs attendus et stockage (sans schéma neuf)

| Champ logique | Stockage existant |
|---------------|-------------------|
| provider | `Payment.provider` |
| providerPaymentId | `Payment.providerReference` |
| providerTransactionId | `Payment.providerResponse.transactionId` (Json) |
| redirectUrl | non persisté (transient, renvoyé à l'action) |
| returnUrl / cancelUrl | construits côté serveur (config), non persistés |
| webhook payload | `Payment.providerResponse` (Json) |
| signature verification | placeholder dans l'adaptateur ; aucun champ requis |

---

## 6. Préparation Flouci

- Flux probable : génération d'une **URL de paiement** (redirect) + URLs de retour succès/échec ; vérification via token privé backend.
- Stockage sans migration : `Payment.provider = "flouci"`, `Payment.providerReference = <payment id Flouci>`, `Payment.providerResponse = <payload JSON>`. `@@unique([provider, providerReference])` évite les doublons.
- Sécurité : **token privé jamais côté client** ; création de session et vérification **server-side only**.
- **Verdict** : stub implémentable **sans changement de schéma**. Intégration réelle = D7.3 (credentials requis).

---

## 7. Préparation ClicToPay / Monétique Tunisie

- Flux probable : passerelle bancaire SPS, credentials marchand, redirect carte. Documentation/kit marchand officiel requis (non présent dans le repo).
- Stockage sans migration : `Payment.provider = "clictopay"`, `providerReference`, `providerResponse` (Json) suffisent pour identifiants d'ordre / transaction.
- **Verdict** : stub implémentable **sans changement de schéma**. Intégration réelle = D7.3, **bloquée** tant que le kit marchand / la doc API ne sont pas disponibles.

---

## 8. Recommandations de sécurité

- Création de paiement et de session **exclusivement server-side** (server actions / route handlers).
- **Aucune clé privée fournisseur côté client** ; lecture via variables d'environnement serveur.
- Webhooks : **vérifier la signature / la réponse fournisseur** avant toute mise à jour de statut ; ne jamais faire confiance au seul retour navigateur.
- Justificatifs uploadés : **valider type MIME et taille** (ex. pdf/jpg/png, limite Mo) avant persistance ; nom de fichier assaini par l'adaptateur de stockage.
- Le participant ne doit accéder **qu'à son propre** paiement / sa propre référence (pas d'énumération d'IDs).
- Validation admin **derrière RBAC** (`payments.validate`, `payments.proofs.review`).
- **Aucun statut de paiement ne doit être déduit d'un paramètre d'URL** (principe déjà appliqué en D6.1 pour la confirmation).

---

## 9. Périmètre D7 recommandé

1. **D7.1 — Paiement manuel / hors-ligne + upload de justificatif**
   - `bank_transfer`, `manual` (chèque/autre), `on_site`, PO via `billingInfo`.
   - `PaymentProof` + `MediaAsset` + `StoragePort`.
   - Mapping RBAC `finance_manager` → permissions paiement (code).
2. **D7.2 — Abstraction fournisseur (stubs)**
   - `PaymentProviderPort` + `ManualPaymentAdapter` réel + `FlouciPaymentAdapter` / `ClicToPayPaymentAdapter` en `NotImplemented`.
3. **D7.3 — Intégration réelle Flouci puis ClicToPay**
   - Lorsque tokens / kit marchand disponibles. Webhooks + vérification signature.

Ordre validé par le schéma : le socle (modèles `Payment`/`PaymentProof`/`PaymentStatusHistory`) existe déjà, donc D7.1 d'abord est le chemin le plus sûr.

---

## 10. Décision changement de schéma

| Question | Réponse |
|----------|---------|
| D7.1 paiement manuel/hors-ligne sans migration ? | **Oui** |
| Stub Flouci sans migration ? | **Oui** |
| Stub ClicToPay sans migration ? | **Oui** |
| Valeurs d'enum manquantes ? | **Non** (`cheque`/`autre` → `manual`, sous-type en Json) |
| Champs manquants pour l'intégration réelle ? | **Non bloquant** : `provider` / `providerReference` / `providerResponse` couvrent les besoins. Optionnel ultérieur : champ dédié PO si reporting requis (sinon `billingInfo` Json suffit). |

**Conclusion** : D7.1, D7.2 et les stubs fournisseurs sont implémentables **sans aucun changement de schéma ni migration**. Une éventuelle évolution (champ PO dédié, enum de sous-méthode) ne serait justifiée que pour des besoins de reporting fin, et reste **optionnelle**.

---

## Annexe — Fichiers / éléments audités

- `prisma/schema.prisma` : `Payment`, `PaymentProof`, `PaymentStatusHistory`, `Registration`, `MediaAsset`, `AuditLog` ; enums `PaymentMethod`, `PaymentRecordStatus`, `ProofStatus`, `RegistrationPaymentStatus`, `Currency`, `MediaCategory`.
- `src/lib/ports/storage.port.ts`, `src/lib/ports/mail.port.ts` (+ `src/lib/storage.ts`, `src/lib/mail.ts`).
- `src/lib/rbac/permissions.ts` (`ROLE_PERMISSIONS`, `can`), `src/server/policies/auth.policy.ts` (`requirePermission`).
- `prisma/seed.ts` : permissions `payments.*` définies ; mapping rôle→permission paiement **non encore seedé** (TODO).
- `src/server/services/public-registration.service.ts` (workflow D6, statut `exempted`/`not_paid`).
