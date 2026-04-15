# Facture

> Template à remplir pour chaque facture client. Format compatible avec une mise en page PDF simple. Tous les `[CHAMPS]` sont à compléter.

---

## En-tête

**FACTURE**
**N° :** [NUMERO_FACTURE, ex : INV-001]

| Date d'émission | [DATE_EMISSION_JJ/MM/AAAA] |
|---|---|
| Date de prestation | [DATE_PRESTATION_JJ/MM/AAAA] |
| Date d'échéance | [DATE_ECHEANCE_JJ/MM/AAAA] *(par défaut J+30)* |

---

## Émetteur

**[TON_NOM_OU_NOM_ENTREPRISE]**
[TON_ADRESSE]
[TON_CODE_POSTAL] [TA_VILLE], [TON_PAYS]
SIRET : [TON_SIRET]
Email : [TON_EMAIL]

---

## Destinataire

**[NOM_CLIENT_OU_SOCIETE]**
[ADRESSE_CLIENT]
[CODE_POSTAL_CLIENT] [VILLE_CLIENT], [PAYS_CLIENT]
Email : [EMAIL_CLIENT]

---

## Détail

| Description | Quantité | Prix unitaire (€) | Montant (€) |
|---|---:|---:|---:|
| [DESCRIPTION_LIGNE_1] | [QTE] | [PU] | [MONTANT] |
| [DESCRIPTION_LIGNE_2] | [QTE] | [PU] | [MONTANT] |
| [DESCRIPTION_LIGNE_3] | [QTE] | [PU] | [MONTANT] |

---

## Total

| | |
|---|---:|
| Sous-total HT | **[MONTANT_HT] €** |
| TVA | **[MONTANT_TVA — souvent 0 €]** |
| **TOTAL À PAYER** | **[MONTANT_TOTAL] €** |

---

## Conditions de paiement

**Mode de paiement accepté :** [VIREMENT / STRIPE / AUTRE]

**Lien de paiement :** [LIEN_STRIPE_OU_AUTRE — facultatif]

**Coordonnées bancaires (si virement) :**
IBAN : [TON_IBAN]
BIC : [TON_BIC]
Banque : [TA_BANQUE]

---

## Mentions légales

[ADAPTER À TON STATUT — exemples :]

- *TVA non applicable, art. 293 B du CGI* (si tu es micro-entrepreneur en franchise de TVA)
- En cas de retard de paiement, des pénalités sont dues au taux de 3 fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de recouvrement de 40 €.
- Pas d'escompte pour règlement anticipé.

---

**Merci pour votre confiance.**

[TON_NOM] — [TON_EMAIL]
