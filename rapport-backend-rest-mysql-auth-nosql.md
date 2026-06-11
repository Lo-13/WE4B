# Rapport de contribution - Backend REST, MySQL, authentification et NoSQL

## 1. Contexte

Cette partie du projet concerne l'intégration backend du site de réservation de salles de gaming.

Au départ, le frontend Angular fonctionnait principalement avec des données mockées. L'objectif de cette contribution était de mettre en place un vrai backend REST, connecté à une base de données MySQL, puis de relier progressivement le frontend Angular à cette API.

La contribution couvre aussi l'amélioration de l'authentification avec vérification du mot de passe hashé, ainsi que la mise en place de MongoDB pour la partie NoSQL liée aux logs, métadonnées et statistiques.

## 2. Technologies utilisées

### Backend

- NestJS
- TypeScript
- TypeORM
- MySQL
- bcrypt
- Mongoose
- MongoDB

### Frontend

- Angular
- TypeScript
- HttpClient

### Bases de données

- MySQL pour les données principales du site :
  - utilisateurs
  - salles
  - jeux
  - réservations
  - commentaires
  - paiements
  - matériel

- MongoDB pour les données NoSQL :
  - logs d'activité
  - métadonnées de fichiers
  - statistiques d'utilisation

## 3. Mise en place de l'API REST

Une API REST a été créée côté backend afin de remplacer les données mockées utilisées dans le frontend.

Le backend expose maintenant les routes sous le préfixe :

```text
/api
```

Exemple :

```text
GET /api/rooms
POST /api/auth/login
GET /api/reservations/user/:userId
```

Le fichier principal du backend configure également CORS pour autoriser le frontend Angular lancé en local.

Fichier concerné :

```text
backend/src/main.ts
```

Le backend peut ainsi être appelé depuis Angular, même si le frontend tourne sur un port différent.

## 4. Endpoints REST ajoutés ou utilisés

### Authentification

Fichiers principaux :

```text
backend/src/auth/auth.controller.ts
backend/src/auth/auth.service.ts
backend/src/auth/dto/login.dto.ts
backend/src/auth/dto/register.dto.ts
```

Routes :

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

Fonctionnalités :

- connexion avec email et mot de passe
- vérification du mot de passe hashé
- inscription utilisateur
- déconnexion
- récupération de l'utilisateur courant
- mapping des rôles backend vers les rôles frontend

Mapping des rôles :

```text
user        -> client
admin       -> admin
super_admin -> super-admin
```

### Salles

Fichiers principaux :

```text
backend/src/rooms/rooms.controller.ts
backend/src/rooms/rooms.service.ts
```

Routes :

```text
GET /api/rooms
GET /api/rooms/:id
```

Fonctionnalités :

- récupération de la liste des salles depuis MySQL
- récupération du détail d'une salle
- inclusion des jeux disponibles
- inclusion du matériel disponible
- formatage des données pour correspondre au modèle attendu par Angular

### Réservations

Fichiers principaux :

```text
backend/src/reservations/reservations.controller.ts
backend/src/reservations/reservations.service.ts
```

Routes :

```text
GET /api/reservations
GET /api/reservations/user/:userId
POST /api/reservations
PATCH /api/reservations/:id/comment
PATCH /api/reservations/:id/status
PATCH /api/reservations/:id/cancel
```

Fonctionnalités :

- récupération de toutes les réservations
- récupération des réservations d'un utilisateur
- création d'une réservation
- ajout ou modification d'un commentaire
- changement de statut d'une réservation
- annulation d'une réservation
- calcul du prix selon la durée et le prix horaire de la salle
- validation de la capacité, de l'utilisateur et de la salle

### NoSQL

Fichiers principaux :

```text
backend/src/nosql/nosql.module.ts
backend/src/nosql/nosql.service.ts
backend/src/nosql/nosql.controller.ts
```

Routes :

```text
GET /api/nosql/logs
GET /api/nosql/files
GET /api/nosql/stats
POST /api/nosql/files
```

Fonctionnalités :

- consultation des logs
- consultation des métadonnées de fichiers
- consultation des statistiques
- ajout de métadonnées de fichiers
- enregistrement d'événements comme les connexions, réservations et consultations

## 5. Connexion à MySQL

La connexion à MySQL a été mise en place avec TypeORM.

Fichier principal :

```text
backend/src/database/database.module.ts
```

La configuration est lue depuis le fichier `.env` :

```text
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=we4x_si40_db
MONGO_URI=mongodb://127.0.0.1:27017/gaming_rooms_nosql
```

Le fichier `.env` reste local et ne doit pas forcément être versionné avec les vrais identifiants.

## 6. Entités TypeORM

Des entités TypeORM ont été créées pour représenter les tables MySQL.

Dossier :

```text
backend/src/database/entities
```

Entités principales :

```text
user.entity.ts
room.entity.ts
reservation.entity.ts
comment.entity.ts
game.entity.ts
payment.entity.ts
type-material.entity.ts
```

Ces entités permettent au backend de manipuler les données SQL sous forme d'objets TypeScript.

## 7. Fichiers SQL ajoutés ou mis à jour

Dossier :

```text
backend/database
```

Fichiers importants :

```text
backend/database/we4x_si40_db.sql
backend/database/rest-api-demo-users.sql
backend/database/original-we4x_si40_project.sql
backend/database/README.md
```

### we4x_si40_db.sql

Ce fichier contient le dump complet de la base MySQL utilisée par le projet.

Il permet de recréer :

- les tables
- les relations
- les données de salles
- les utilisateurs
- les réservations existantes
- les commentaires
- les jeux
- le matériel

### rest-api-demo-users.sql

Ce fichier sert à créer ou mettre à jour les comptes de test.

Comptes disponibles :

```text
b@gamingrooms.fr -> client
a@gamingrooms.fr -> admin
j@gamingrooms.fr -> super-admin
```

Mot de passe de test :

```text
demo123
```

Le mot de passe n'est pas stocké en clair dans la base : il est stocké sous forme de hash bcrypt.

Le script a été corrigé pour que le champ `password` soit aussi mis à jour en cas de doublon :

```sql
`password` = VALUES(`password`)
```

Sans cette ligne, les utilisateurs déjà existants conservaient leur ancien mot de passe.

## 8. Intégration Angular avec HttpClient

Le frontend Angular a été relié au backend REST.

Fichiers principaux :

```text
frontend/src/main.ts
frontend/src/app/core/api.config.ts
frontend/src/app/core/services/auth.service.ts
frontend/src/app/core/services/rooms.service.ts
frontend/src/app/core/services/reservations.service.ts
frontend/src/app/features/login/login.component.ts
frontend/src/app/features/login/login.component.html
frontend/src/app/features/my-reservations/my-reservations.component.ts
```

Le frontend appelle maintenant le backend via :

```text
http://localhost:3001/api
```

Les anciennes données mockées ont été remplacées, pour les fonctionnalités principales, par des appels HTTP vers le backend.

Exemples :

- la liste des salles vient de `GET /api/rooms`
- le détail d'une salle vient de `GET /api/rooms/:id`
- la connexion passe par `POST /api/auth/login`
- les réservations utilisateur passent par `GET /api/reservations/user/:userId`
- la création de réservation passe par `POST /api/reservations`

## 9. Authentification avec bcrypt

La logique d'authentification a été améliorée pour ne plus se baser uniquement sur l'email.

Avant :

- le frontend envoyait seulement l'email
- le backend retrouvait l'utilisateur avec cet email
- il n'y avait pas de vraie vérification de mot de passe

Maintenant :

- le frontend envoie email + mot de passe
- le backend vérifie que les deux champs sont présents
- le backend récupère l'utilisateur en base
- le backend compare le mot de passe saisi avec le hash stocké en base
- si le mot de passe est incorrect, le backend renvoie une erreur 401

Dépendances ajoutées :

```text
bcrypt
@types/bcrypt
```

Fichiers concernés :

```text
backend/package.json
backend/package-lock.json
backend/src/auth/auth.service.ts
backend/src/auth/dto/login.dto.ts
frontend/src/app/core/services/auth.service.ts
frontend/src/app/features/login/login.component.ts
frontend/src/app/features/login/login.component.html
```

Le backend gère aussi les anciens hash bcrypt commençant par `$2y$`, souvent utilisés côté PHP, en les normalisant pour Node.js.

## 10. Inscription utilisateur

Une route d'inscription a été ajoutée :

```text
POST /api/auth/register
```

Lorsqu'un utilisateur s'inscrit :

- les champs obligatoires sont vérifiés
- l'email est normalisé en minuscules
- le backend vérifie si l'email existe déjà
- le mot de passe est hashé avec bcrypt
- l'utilisateur est enregistré en MySQL
- l'utilisateur connecté est renvoyé au frontend

Si aucun mot de passe n'est fourni, le backend utilise un mot de passe temporaire. Idéalement, côté frontend, il faut toujours envoyer un mot de passe explicite.

## 11. Mise en place de MongoDB

MongoDB a été installé localement pour la partie NoSQL.

Installation locale utilisée :

```text
D:\Tools\MongoDB
```

Données MongoDB :

```text
D:\MongoDB\data\db
```

Logs MongoDB :

```text
D:\MongoDB\log\mongod.log
```

Script de démarrage local :

```text
D:\Tools\MongoDB\start-mongodb.ps1
```

Commande de démarrage :

```powershell
powershell -ExecutionPolicy Bypass -File D:\Tools\MongoDB\start-mongodb.ps1
```

MongoDB écoute sur :

```text
127.0.0.1:27017
```

La variable d'environnement utilisée par le backend est :

```text
MONGO_URI=mongodb://127.0.0.1:27017/gaming_rooms_nosql
```

## 12. Gestion du cas où MongoDB n'est pas disponible

Le backend a été adapté pour éviter que l'absence de MongoDB bloque complètement l'API REST.

Si `MONGO_URI` n'est pas configuré, le module NoSQL ne force pas la connexion MongoDB.

Cela permet de continuer à utiliser les fonctionnalités principales :

- connexion
- affichage des salles
- réservations
- commentaires
- administration des réservations

Quand MongoDB est disponible et que `MONGO_URI` est configuré, les logs et statistiques sont enregistrés normalement.

## 13. Tests effectués

### Build backend

Commande :

```bash
npm run build
```

Résultat :

```text
OK
```

### Build frontend

Commande :

```bash
npm run build
```

Résultat :

```text
OK
```

Des warnings Angular existent encore, notamment sur la taille du bundle et Leaflet en CommonJS, mais ils ne bloquent pas la compilation.

### Test de connexion REST

Requête testée :

```text
POST http://localhost:3001/api/auth/login
```

Body :

```json
{
  "email": "b@gamingrooms.fr",
  "password": "demo123"
}
```

Résultat :

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

### Test mauvais mot de passe

Body :

```json
{
  "email": "b@gamingrooms.fr",
  "password": "wrong"
}
```

Résultat attendu :

```text
401 Invalid credentials
```

Le test est OK.

### Test MongoDB

MongoDB a été testé directement avec Mongoose.

Résultat :

```text
MongoDB connection OK
```

### Test logs NoSQL

Après une connexion réussie, la route suivante retourne un log :

```text
GET /api/nosql/logs
```

Exemple de log :

```json
{
  "userId": 58,
  "email": "b@gamingrooms.fr",
  "action": "login",
  "targetType": "user",
  "targetId": 58,
  "metadata": {
    "role": "client"
  }
}
```

## 14. Commandes pour lancer le projet

### 1. Lancer MySQL

MySQL doit être démarré avec la base :

```text
we4x_si40_db
```

Si besoin, importer :

```text
backend/database/we4x_si40_db.sql
```

Puis mettre à jour les comptes de test :

```text
backend/database/rest-api-demo-users.sql
```

### 2. Lancer MongoDB

```powershell
powershell -ExecutionPolicy Bypass -File D:\Tools\MongoDB\start-mongodb.ps1
```

### 3. Lancer le backend

```powershell
cd D:\UTBM_cours\WE\WE4B\backend
npm run start:dev
```

Backend :

```text
http://localhost:3001/api
```

### 4. Lancer le frontend

```powershell
cd D:\UTBM_cours\WE\WE4B\frontend
npm start
```

Frontend :

```text
http://localhost:4200
```

## 15. Comptes de test

```text
Client :
b@gamingrooms.fr
demo123

Admin :
a@gamingrooms.fr
demo123

Super-admin :
j@gamingrooms.fr
demo123
```

## 16. Points importants pour les autres membres du groupe

1. Le frontend ne doit pas appeler `localhost:3000`, mais :

```text
http://localhost:3001/api
```

2. Les mots de passe ne sont plus en clair dans MySQL.

3. Si les comptes de test ne fonctionnent pas, il faut réimporter :

```text
backend/database/rest-api-demo-users.sql
```

4. Si MongoDB n'est pas lancé, les fonctions principales peuvent encore marcher, mais les logs/statistiques NoSQL ne seront pas enregistrés.

5. Pour tester les logs, il faut :

- démarrer MongoDB
- démarrer le backend après MongoDB
- se connecter avec un compte de test
- appeler `GET /api/nosql/logs`

## 17. Résumé de la contribution

Cette contribution a permis de transformer une base frontend avec données mockées en application connectée à un vrai backend.

Les éléments réalisés sont :

- création et structuration d'une API REST NestJS
- connexion du backend à MySQL avec TypeORM
- création des entités SQL nécessaires
- ajout des endpoints pour salles, réservations, authentification et NoSQL
- remplacement progressif des mocks Angular par des appels HTTP
- ajout de la vraie vérification des mots de passe avec bcrypt
- mise à jour des comptes de test avec des mots de passe hashés
- ajout d'un dump SQL complet pour recréer la base
- installation et configuration de MongoDB
- connexion du backend à MongoDB avec Mongoose
- enregistrement et consultation des logs NoSQL
- tests de build backend/frontend
- tests manuels des endpoints principaux

La partie backend REST + connexion MySQL + authentification sécurisée + intégration MongoDB est donc prête pour être testée par le reste de l'équipe.

