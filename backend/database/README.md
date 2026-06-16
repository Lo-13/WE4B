# Base de donnees du projet

Pour le rendu, il faut utiliser une seule base MySQL fonctionnelle :

```text
we4x_si40_db
```

## Fichiers a utiliser

Importer dans cet ordre :

1. `we4x_si40_db.sql`
2. `rest-api-demo-users.sql`

Le fichier `we4x_si40_db.sql` contient la structure et les donnees principales :

- salles ;
- utilisateurs ;
- reservations ;
- commentaires ;
- paiements ;
- jeux ;
- materiel ;
- relations entre les tables.

Le fichier `rest-api-demo-users.sql` remet les comptes de demonstration avec les bons roles et le bon mot de passe.

## Import dans phpMyAdmin

1. Ouvrir phpMyAdmin.
2. Creer une base nommee exactement :

```text
we4x_si40_db
```

3. Selectionner cette base.
4. Aller dans l'onglet `Importer`.
5. Importer :

```text
backend/database/we4x_si40_db.sql
```

6. Revenir dans `Importer`.
7. Importer ensuite :

```text
backend/database/rest-api-demo-users.sql
```

## Comptes de test

Mot de passe commun :

```text
demo123
```

Client :

```text
b@gamingrooms.fr
```

Administrateur :

```text
a@gamingrooms.fr
```

Super-admin present en base :

```text
j@gamingrooms.fr
```

La version de rendu n'expose pas de page super-admin dans l'interface, car cette partie n'est pas finalisee.

## Configuration backend

Le fichier `backend/.env` doit pointer vers cette base :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=we4x_si40_db
```

Adapter `DB_PASSWORD` selon la configuration locale de MySQL/phpMyAdmin.

## MongoDB

MongoDB est utilise pour la partie NoSQL :

```text
gaming_rooms_nosql
```

Collections :

```text
activity_logs
usage_stats
file_metadata
```

URI utilisee par le backend :

```env
MONGO_URI=mongodb://127.0.0.1:27017/gaming_rooms_nosql
```
