# Gaming Rooms - WE4B / SI40

Application web de reservation de salles de gaming.

Le projet est separe en deux parties :

- `frontend/` : application Angular.
- `backend/` : API NestJS connectee a MySQL et MongoDB.

## Technologies

Frontend :

- Angular
- TypeScript
- Tailwind CSS
- Leaflet pour la carte

Backend :

- NestJS
- TypeScript
- TypeORM
- MySQL
- MongoDB avec Mongoose
- bcrypt pour les mots de passe

## Installation

Installer les dependances du backend :

```powershell
cd backend
npm install
```

Installer les dependances du frontend :

```powershell
cd frontend
npm install
```

Ne pas deposer les dossiers `node_modules` sur Moodle.

## Configuration backend

Le backend lit sa configuration dans `backend/.env`.

Exemple de configuration :

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=we4x_si40_db

MONGO_URI=mongodb://127.0.0.1:27017/gaming_rooms_nosql
```

Le fichier `backend/.env.example` donne un exemple de configuration.

## Base MySQL

La base attendue par le backend s'appelle :

```text
we4x_si40_db
```

### Import avec phpMyAdmin

1. Ouvrir phpMyAdmin.
2. Creer une base nommee `we4x_si40_db` si elle n'existe pas.
3. Selectionner la base `we4x_si40_db`.
4. Aller dans l'onglet `Importer`.
5. Importer le fichier :

```text
backend/database/we4x_si40_db.sql
```

6. Importer ensuite le fichier des comptes de test :

```text
backend/database/rest-api-demo-users.sql
```

Le second fichier remet les comptes de demonstration avec les bons roles et le bon mot de passe.

### Comptes de test

Mot de passe pour tous les comptes :

```text
demo123
```

Compte client :

```text
b@gamingrooms.fr
```

Compte administrateur :

```text
a@gamingrooms.fr
```

Compte super administrateur present en base :

```text
j@gamingrooms.fr
```

Dans la version de rendu, la partie super-admin n'est pas exposee dans l'interface car elle n'est pas finalisee.

## MongoDB

MongoDB est utilise pour la partie NoSQL.

Base :

```text
gaming_rooms_nosql
```

Collections :

```text
activity_logs
usage_stats
file_metadata
```

Exemples de donnees stockees :

- connexions et deconnexions ;
- creation de compte ;
- creation de reservation ;
- consultation de salles ;
- changement de statut de reservation ;
- metadonnees de fichiers.

Si MongoDB n'est pas lance ou si `MONGO_URI` n'est pas configure, les fonctionnalites principales MySQL restent utilisables.

## Lancer le backend

Depuis le dossier `backend` :

```powershell
npm run start:dev
```

API :

```text
http://localhost:3001/api
```

Test rapide :

```text
http://localhost:3001/api
```

La reponse attendue contient :

```json
{
  "name": "Gaming Rooms API",
  "status": "ok"
}
```

## Lancer le frontend

Depuis le dossier `frontend` :

```powershell
npm start
```

Site :

```text
http://localhost:4200
```

Le frontend appelle le backend avec :

```text
http://localhost:3001/api
```

Configuration :

```text
frontend/src/app/core/api.config.ts
```

## Fonctionnalites principales

- Connexion et inscription.
- Verification des mots de passe avec bcrypt.
- Liste des salles de gaming.
- Detail d'une salle.
- Carte Leaflet des salles.
- Reservation d'une salle par un utilisateur connecte.
- Consultation des reservations de l'utilisateur.
- Administration des reservations.
- Logs et statistiques MongoDB pour l'administration.

## Routes Angular importantes

```text
/dashboard
/rooms
/rooms/:id
/rooms/:id/reserve
/my-reservations
/reservations
/admin-logs
/profile
/login
```

Routes protegees :

- `authGuard` protege les pages qui demandent une connexion.
- `roleGuard` protege les pages d'administration.

## Endpoints principaux

Authentification :

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

Salles :

```text
GET /api/rooms
GET /api/rooms/:id
```

Reservations :

```text
GET   /api/reservations
GET   /api/reservations/user/:userId
POST  /api/reservations
PATCH /api/reservations/:id/comment
PATCH /api/reservations/:id/status
PATCH /api/reservations/:id/cancel
```

NoSQL :

```text
GET  /api/nosql/logs
GET  /api/nosql/stats
GET  /api/nosql/files
POST /api/nosql/files
```

## Verification avant rendu

Backend :

```powershell
cd backend
npm run build
```

Frontend :

```powershell
cd frontend
npm run build
```

Les deux commandes doivent se terminer sans erreur.

## Fichiers a ne pas deposer

Ne pas inclure :

- `node_modules/`
- `dist/`
- `.git/`
- `.idea/`
- fichiers de revision ou fiches d'examen
- caches locaux

Pour Moodle, preparer des archives propres selon les consignes WE4B/SI40.
