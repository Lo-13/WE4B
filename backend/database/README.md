# Base de donnees

## MySQL

Importer le dump principal :

```text
backend/database/we4x_si40_db.sql
```

Il contient les tables et les donnees de test necessaires au backend.

Comptes disponibles :

```text
b@gamingrooms.fr  client
a@gamingrooms.fr  admin
j@gamingrooms.fr  super-admin
```

Le fichier `original-we4x_si40_project.sql` est conserve comme archive de l'ancien projet.

## MongoDB

Connexion locale :

```text
mongodb://127.0.0.1:27017
```

Base :

```text
gaming_rooms_nosql
```

Collections utilisees :

```text
activity_logs
usage_stats
file_metadata
```
