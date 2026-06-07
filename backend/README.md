# Backend Gaming Rooms

API REST NestJS pour le projet WE4B.

## Lancer le backend

```powershell
npm install
Copy-Item .env.example .env
npm run start:dev
```

Le backend expose l'API sur :

```text
http://localhost:3000/api
```

## Bases de donnees

- MySQL : utilisateurs, salles, reservations, jeux, paiements.
- MongoDB : logs d'activite, statistiques d'utilisation, metadonnees de fichiers.

Configuration attendue dans `.env` :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=we4x_si40_db
MONGO_URI=mongodb://127.0.0.1:27017/gaming_rooms_nosql
```
