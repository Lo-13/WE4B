# Rapport - API REST Backend et Connexion MySQL

## Objectif

Cette partie correspond à la tâche :

```text
API REST backend + connexion MySQL
```

L'objectif était de remplacer les données mockées côté Angular par des appels HTTP vers un backend NestJS connecté à une base de données MySQL.

Avant :

```text
Angular utilisait des tableaux mockés dans les services.
```

Maintenant :

```text
Angular -> HttpClient -> API REST NestJS -> MySQL
```

## Technologies

Backend :

```text
Node.js
NestJS
TypeScript
TypeORM
MySQL
```

Frontend concerné :

```text
Angular HttpClient
```

Base de données :

```text
we4x_si40_db
```

## Structure Backend Ajoutée

Les principaux dossiers ajoutés/modifiés sont :

```text
backend/src/auth
backend/src/rooms
backend/src/reservations
backend/src/database
backend/database
```

### Authentification

```text
backend/src/auth/auth.controller.ts
backend/src/auth/auth.service.ts
backend/src/auth/auth.module.ts
```

Cette partie gère la connexion et les rôles utilisateur.

### Salles

```text
backend/src/rooms/rooms.controller.ts
backend/src/rooms/rooms.service.ts
backend/src/rooms/rooms.module.ts
```

Cette partie gère la liste des salles et le détail d'une salle.

### Réservations

```text
backend/src/reservations/reservations.controller.ts
backend/src/reservations/reservations.service.ts
backend/src/reservations/reservations.module.ts
```

Cette partie gère les réservations, les commentaires et les changements de statut.

### Base de données

```text
backend/src/database/database.module.ts
backend/src/database/entities
```

Les entités TypeORM correspondent aux tables MySQL utilisées par l'API.

## Configuration

Le backend utilise un fichier `.env` local :

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=we4x_si40_db
```

Le fichier `.env` n'est pas commité, car il contient un mot de passe local.

Un modèle est disponible ici :

```text
backend/.env.example
```

Le port utilisé actuellement est `3001`, car le port `3000` était déjà occupé localement.

## Fichiers SQL

Les fichiers SQL sont dans :

```text
backend/database
```

### Fichier principal

```text
backend/database/we4x_si40_db.sql
```

C'est le fichier SQL à utiliser pour recréer la base compatible avec le backend actuel.

Il contient :

```text
CREATE DATABASE
CREATE TABLE
INSERT INTO
```

Commande d'import :

```powershell
cd D:\UTBM_cours\WE\WE4B\backend
mysql -u root -p < database\we4x_si40_db.sql
```

### Fichier SQL original

```text
backend/database/original-we4x_si40_project.sql
```

Ce fichier est conservé comme trace de l'ancien projet.

Il n'est pas utilisé directement par le backend actuel, car certains noms de tables/champs sont différents :

```text
commentaire  -> comment
paiement     -> payment
type_materiel -> type_material
plateforme   -> plateform
```

### Utilisateurs de test

```text
backend/database/rest-api-demo-users.sql
```

Ce script ajoute les comptes de test Angular :

```text
b@gamingrooms.fr
a@gamingrooms.fr
j@gamingrooms.fr
```

Ces utilisateurs sont déjà inclus dans `we4x_si40_db.sql`.

## API REST

Base URL :

```text
http://localhost:3001/api
```

### Health Check

```http
GET /api
```

Retour :

```json
{
  "name": "Gaming Rooms API",
  "status": "ok"
}
```

## Auth API

### Connexion

```http
POST /api/auth/login
```

Body :

```json
{
  "email": "b@gamingrooms.fr"
}
```

Retour :

```json
{
  "user": {
    "id": 58,
    "name": "Benjamin Dupuis",
    "email": "b@gamingrooms.fr",
    "role": "client"
  }
}
```

Le backend cherche l'utilisateur dans la table MySQL :

```text
user
```

Mapping des rôles :

```text
user        -> client
admin       -> admin
super_admin -> super-admin
```

Comptes disponibles :

```text
b@gamingrooms.fr -> client
a@gamingrooms.fr -> admin
j@gamingrooms.fr -> super-admin
```

## Rooms API

### Liste des salles

```http
GET /api/rooms
```

Cette route remplace les anciennes données mockées du `RoomsService`.

Les données viennent des tables :

```text
room
game
type_material
room_game
room_type_material
```

Exemple de retour :

```json
{
  "id": 1,
  "name": "Alpha PC",
  "city": "Paris",
  "address": "12 Rue Oberkampf, 75011 Paris",
  "capacity": 6,
  "hourlyPrice": 15,
  "equipment": ["Ecran 144Hz", "PC Gaming"],
  "games": ["Counter-Strike 2", "League of Legends", "Valorant"],
  "status": "available",
  "imageUrl": "https://images.unsplash.com/...",
  "description": "Salle PC compacte avec 6 postes..."
}
```

### Détail d'une salle

```http
GET /api/rooms/:id
```

Exemple :

```http
GET /api/rooms/1
```

Utilisé par :

```text
Page détail salle
Formulaire de réservation
```

## Reservations API

### Toutes les réservations

```http
GET /api/reservations
```

Utilisé par la page admin des réservations.

### Réservations d'un utilisateur

```http
GET /api/reservations/user/:userId
```

Exemple :

```http
GET /api/reservations/user/58
```

Utilisé par :

```text
Mes réservations
```

### Créer une réservation

```http
POST /api/reservations
```

Body :

```json
{
  "userId": 58,
  "roomId": 1,
  "customerName": "Benjamin Dupuis",
  "startDate": "2026-06-12",
  "startTime": "18:00",
  "duration": 2,
  "playerCount": 4
}
```

Retour :

```json
{
  "id": 61,
  "userId": 58,
  "roomId": 1,
  "roomName": "Alpha PC",
  "customerName": "Benjamin Dupuis",
  "startDate": "2026-06-12",
  "startTime": "18:00",
  "duration": 2,
  "playerCount": 4,
  "totalPrice": 30,
  "status": "pending",
  "paymentStatus": "pending"
}
```

Logique backend :

```text
Le backend vérifie que l'utilisateur existe.
Le backend vérifie que la salle existe.
Le backend vérifie que la salle est disponible.
Le backend vérifie que le nombre de joueurs ne dépasse pas la capacité.
Le backend calcule le prix total à partir du tarif horaire en base.
```

Calcul :

```text
totalPrice = duration * room.hourly_rate
```

### Ajouter un commentaire

```http
PATCH /api/reservations/:id/comment
```

Body :

```json
{
  "rating": 8,
  "content": "Tres bonne salle."
}
```

Règles :

```text
La réservation doit être confirmée.
La note doit être entre 1 et 10.
Le commentaire ne doit pas être vide.
```

### Modifier le statut d'une réservation

```http
PATCH /api/reservations/:id/status
```

Body :

```json
{
  "status": "confirmed"
}
```

Statuts acceptés :

```text
pending
confirmed
cancelled
```

### Annuler une réservation

```http
PATCH /api/reservations/:id/cancel
```

Met la réservation au statut :

```text
cancelled
```

## Intégration Angular

Les services Angular ont été modifiés pour utiliser `HttpClient`.

Fichiers concernés :

```text
frontend/src/main.ts
frontend/src/app/core/api.config.ts
frontend/src/app/core/services/rooms.service.ts
frontend/src/app/core/services/auth.service.ts
frontend/src/app/core/services/reservations.service.ts
frontend/src/app/features/login/login.component.ts
frontend/src/app/features/my-reservations/my-reservations.component.ts
```

Avant :

```ts
return of(ROOMS);
```

Après :

```ts
return this.http.get<GamingRoom[]>(`${API_BASE_URL}/rooms`);
```

Cela signifie que les données affichées viennent maintenant de l'API et donc de MySQL.

## Exemple de Flux

### Liste des salles

```text
Angular RoomsService
  -> GET /api/rooms
  -> NestJS RoomsController
  -> RoomsService
  -> MySQL
  -> JSON
  -> Affichage Angular
```

### Connexion

```text
Angular LoginComponent
  -> POST /api/auth/login
  -> AuthService NestJS
  -> Table user
  -> Retour utilisateur + rôle
  -> Angular met à jour l'utilisateur connecté
```

### Création de réservation

```text
Angular ReservationFormComponent
  -> POST /api/reservations
  -> ReservationsService NestJS
  -> Vérifications backend
  -> Calcul du prix
  -> INSERT dans reservation
  -> Retour JSON
  -> Angular affiche Mes réservations
```

## Comment Tester

### Backend

```powershell
cd D:\UTBM_cours\WE\WE4B\backend
npm install
npm run start
```

Backend :

```text
http://localhost:3001/api
```

### Frontend

```powershell
cd D:\UTBM_cours\WE\WE4B\frontend
npm install
npm run start
```

### Tester les routes

```powershell
Invoke-RestMethod http://localhost:3001/api/rooms
```

```powershell
Invoke-RestMethod -Method Post http://localhost:3001/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"b@gamingrooms.fr"}'
```

```powershell
Invoke-RestMethod http://localhost:3001/api/reservations/user/58
```

### Vérifier directement MySQL

```powershell
mysql -u root -p we4x_si40_db -e "SELECT id,name,capacity,hourly_rate,status FROM room LIMIT 5;"
```

```powershell
mysql -u root -p we4x_si40_db -e "SELECT id,email,name,last_name,role FROM user WHERE email IN ('b@gamingrooms.fr','a@gamingrooms.fr','j@gamingrooms.fr');"
```

```powershell
mysql -u root -p we4x_si40_db -e "SELECT id,user_id,room_id,date_begin,date_end,total_price,status FROM reservation ORDER BY id DESC LIMIT 5;"
```

## Validation

Commandes exécutées :

```powershell
cd D:\UTBM_cours\WE\WE4B\backend
npm run build
npm test
npm run test:e2e
```

Résultat :

```text
Backend build OK
Unit tests OK
E2E tests OK
```

Frontend :

```powershell
cd D:\UTBM_cours\WE\WE4B\frontend
npm run build
```

Résultat :

```text
Frontend build OK
```

## Ce Que Cette Partie Apporte

Cette partie permet de montrer que :

```text
Les salles ne viennent plus d'un tableau mocké Angular.
Les utilisateurs sont lus depuis MySQL.
Les réservations sont réellement écrites en base.
Le backend fait des validations métier.
Le prix total est calculé côté backend.
La base peut être recréée avec un fichier SQL fourni dans le projet.
```

## Résumé Court

```text
J'ai implémenté une API REST avec NestJS et TypeScript, connectée à MySQL avec TypeORM.
Le frontend Angular utilise maintenant HttpClient pour récupérer les salles, se connecter et gérer les réservations.
Les données principales viennent de la base MySQL we4x_si40_db au lieu des mocks Angular.
```
