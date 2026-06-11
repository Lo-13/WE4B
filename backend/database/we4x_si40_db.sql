-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: we4x_si40_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `we4x_si40_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `we4x_si40_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `we4x_si40_db`;

--
-- Table structure for table `admin_role_request`
--

DROP TABLE IF EXISTS `admin_role_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_role_request` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `request_status` enum('accepted','denied','pending','') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`request_id`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `admin_role_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `admin_role_request_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_role_request`
--

LOCK TABLES `admin_role_request` WRITE;
/*!40000 ALTER TABLE `admin_role_request` DISABLE KEYS */;
INSERT INTO `admin_role_request` VALUES (9,12,8,'pending'),(10,24,9,'pending'),(11,25,10,'pending');
/*!40000 ALTER TABLE `admin_role_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reservation_id` int NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `rate` tinyint NOT NULL,
  `date` datetime NOT NULL,
  `is_valid` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `com_reservation_id` (`reservation_id`),
  KEY `com_user_id` (`user_id`),
  CONSTRAINT `com_reservation_id` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  CONSTRAINT `com_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservation` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (3,55,60,'c\'était génial',10,'2026-05-09 11:24:02',0);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `genre` int NOT NULL,
  `nb_player_max` int NOT NULL,
  `plateform` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,'Counter-Strike 2',1,10,'PC','FPS tactique competitif par equipes de 5.'),(2,'Valorant',1,10,'PC','FPS tactique avec agents et strategies d\'equipe.'),(3,'League of Legends',3,10,'PC','MOBA 5v5 tres joue en competition.'),(4,'Rocket League',5,6,'PC','Football arcade avec voitures, rapide et fun.'),(5,'EA Sports FC 25',5,4,'PlayStation 5','Simulation de football ideale pour jouer entre amis.'),(6,'Mario Kart 8 Deluxe',6,4,'Nintendo Switch','Course arcade familiale et accessible.'),(7,'Super Smash Bros. Ultimate',7,8,'Nintendo Switch','Jeu de combat festif avec de nombreux personnages.'),(8,'Beat Saber',12,4,'VR','Jeu de rythme en realite virtuelle.'),(9,'Minecraft',10,10,'PC','Jeu de construction et de survie en multijoueur.'),(10,'Street Fighter 6',7,2,'PlayStation 5','Jeu de combat technique et competitif.');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_genre`
--

DROP TABLE IF EXISTS `game_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_genre` (
  `game_id` int NOT NULL,
  `genre_id` int NOT NULL,
  KEY `genre_game_id` (`game_id`),
  KEY `genre_genre_id` (`genre_id`),
  CONSTRAINT `genre_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`),
  CONSTRAINT `genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_genre`
--

LOCK TABLES `game_genre` WRITE;
/*!40000 ALTER TABLE `game_genre` DISABLE KEYS */;
INSERT INTO `game_genre` VALUES (1,1),(2,1),(3,3),(4,5),(5,5),(6,6),(7,7),(8,12),(9,10),(10,7);
/*!40000 ALTER TABLE `game_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_plateform`
--

DROP TABLE IF EXISTS `game_plateform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_plateform` (
  `game_id` int NOT NULL,
  `plateforme_id` int NOT NULL,
  KEY `game_id` (`game_id`),
  KEY `plateforme_id` (`plateforme_id`),
  CONSTRAINT `game_plateform_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`),
  CONSTRAINT `game_plateform_ibfk_2` FOREIGN KEY (`plateforme_id`) REFERENCES `plateform` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_plateform`
--

LOCK TABLES `game_plateform` WRITE;
/*!40000 ALTER TABLE `game_plateform` DISABLE KEYS */;
INSERT INTO `game_plateform` VALUES (1,1),(2,1),(3,1),(4,1),(5,2),(6,6),(7,6),(8,8),(9,1),(10,2);
/*!40000 ALTER TABLE `game_plateform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (10,'Aventure'),(7,'Combat'),(6,'Course'),(1,'FPS'),(3,'MOBA'),(5,'Sport'),(12,'VR');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('credit_card','check','cash','other') COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL,
  `status` enum('pending','completed','failed','refunded') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paiement_revervation_id` (`reservation_id`),
  CONSTRAINT `paiement_revervation_id` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,45.00,'credit_card','2026-05-10 14:05:00','completed'),(2,2,40.00,'cash','2026-05-11 18:05:00','completed'),(3,3,36.00,'credit_card','2026-05-12 16:05:00','pending'),(4,4,28.00,'credit_card','2026-05-13 15:05:00','pending');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plateform`
--

DROP TABLE IF EXISTS `plateform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plateform` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plateform`
--

LOCK TABLES `plateform` WRITE;
/*!40000 ALTER TABLE `plateform` DISABLE KEYS */;
INSERT INTO `plateform` VALUES (6,'Nintendo Switch'),(1,'PC'),(2,'PlayStation 5'),(8,'VR');
/*!40000 ALTER TABLE `plateform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `game_id` tinyint NOT NULL,
  `date_reservation` datetime NOT NULL,
  `date_begin` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `nb_player` int NOT NULL,
  `status` int NOT NULL,
  `total_price` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_user_id` (`user_id`),
  KEY `game_id` (`game_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,55,1,1,'2026-05-10 14:00:00','2026-05-10 15:00:00','2026-05-10 18:00:00',5,1,45),(2,2,1,5,'2026-05-11 18:00:00','2026-05-11 19:00:00','2026-05-11 21:00:00',4,1,40),(3,55,1,8,'2026-05-12 16:00:00','2026-05-12 17:00:00','2026-05-12 19:00:00',4,2,36),(4,55,1,4,'2026-05-13 15:00:00','2026-05-13 15:00:00','2026-05-13 17:00:00',4,0,28),(5,11,1,5,'2026-05-09 06:44:01','2026-04-30 14:43:00','2026-04-30 20:54:00',3,0,124),(60,55,12,2,'2026-05-06 12:31:43','2026-05-07 12:31:43','2026-05-08 12:31:43',6,1,135),(61,58,1,1,'2026-06-01 16:09:06','2026-06-12 18:00:00','2026-06-12 20:00:00',4,0,30),(62,58,7,5,'2026-06-01 16:30:05','2026-06-12 18:00:00','2026-06-12 20:00:00',4,0,26),(63,57,5,6,'2026-06-01 16:30:26','2026-06-12 18:00:00','2026-06-12 20:00:00',4,0,32),(64,58,7,5,'2026-06-06 10:39:31','2026-06-12 18:00:00','2026-06-12 20:00:00',4,0,26);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `capacity` int NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('available','unavailable','maintenance','') COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(8,4) NOT NULL,
  `longitude` decimal(9,4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'Alpha PC','12 Rue Oberkampf, 75011 Paris',6,15.00,'Salle PC compacte avec 6 postes, ecrans 144Hz et casques micro.','available',48.8630,2.3688),(2,'Omega Console','25 Rue Merciere, 69002 Lyon',8,20.00,'Salon console avec PS5, canape, television 4K et jeux multijoueurs.','available',45.7631,4.8340),(3,'Nexus Bordeaux','47 Cours Victor Hugo, 33000 Bordeaux',10,14.00,'Salle polyvalente pour groupes, consoles et postes PC legers.','available',44.8376,-0.5743),(4,'VR Lab Lille','6 Rue Nationale, 59000 Lille',6,18.00,'Espace VR avec casques recents et zone de jeu securisee.','available',50.6330,3.0630),(5,'Retro Arcade Nantes','22 Quai de la Fosse, 44000 Nantes',12,16.00,'Salle retro avec bornes arcade et jeux Switch pour soirees entre amis.','available',47.2115,-1.5680),(7,'Console Loft Rennes','9 Rue Saint-Michel, 35000 Rennes',6,13.00,'Petit loft console confortable pour sessions privees.','available',48.1139,-1.6816),(8,'ESport Toulouse','14 Avenue de Muret, 31300 Toulouse',16,25.00,'Salle e-sport pour entrainements d\'equipe et mini-tournois.','available',43.5840,1.4320),(9,'Family Gaming Dijon','4 Rue de la Liberte, 21000 Dijon',5,12.50,'Salle accessible pour familles, jeux cooperatifs et espace detente.','available',47.3215,5.0410),(10,'Studio Marseille','9 Boulevard de Louvain, 13008 Marseille',4,22.00,'Petite salle avec eclairage, micro et PC pour enregistrer ou jouer.','available',43.2765,5.3912),(11,'Maison de l\'Esport','11 Rue Soleillet, 75020 Paris',40,30.00,'Tiers-lieu parisien officiel dédié à l\'esport, arena 600m², régies techniques, consoles next-gen.','available',48.8632,2.4031),(12,'GameRoom Lyon Sud','2 Rue du Professeur Appleton, 69007 Lyon',14,20.00,'Salle gaming à Lyon avec 8 PCs, 4 PS5, 2 Xbox Series X, ambiance néon cosy.','available',45.7423,4.8376),(13,'NexusBox Bordeaux','47 Cours d\'Alsace-et-Lorraine, 33000 Bordeaux',10,17.00,'Petite salle premium à Bordeaux : PS5, Switch, décoration gaming rétro-futuriste.','available',44.8414,-0.5716),(14,'PixelHub Marseille','9 Boulevard de Louvain, 13008 Marseille',18,19.00,'Salle gaming en bord de mer : PCs gaming, PS5, ambiance lounge, boissons incluses.','maintenance',43.2765,5.3912);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_administrator`
--

DROP TABLE IF EXISTS `room_administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_administrator` (
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `room_administrator_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_administrator`
--

LOCK TABLES `room_administrator` WRITE;
/*!40000 ALTER TABLE `room_administrator` DISABLE KEYS */;
INSERT INTO `room_administrator` VALUES (1,13),(2,14),(3,15),(4,16),(5,17),(7,18),(8,19),(9,20),(10,21),(11,22),(12,23);
/*!40000 ALTER TABLE `room_administrator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_game`
--

DROP TABLE IF EXISTS `room_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_game` (
  `room_id` int NOT NULL,
  `game_id` int NOT NULL,
  KEY `room_id` (`room_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`),
  CONSTRAINT `room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_game`
--

LOCK TABLES `room_game` WRITE;
/*!40000 ALTER TABLE `room_game` DISABLE KEYS */;
INSERT INTO `room_game` VALUES (1,1),(1,2),(1,3),(2,5),(2,7),(3,4),(3,5),(4,8),(5,6),(5,7),(7,5),(7,6),(8,1),(8,2),(9,9),(10,10);
/*!40000 ALTER TABLE `room_game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_type_material`
--

DROP TABLE IF EXISTS `room_type_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_type_material` (
  `room_id` int NOT NULL,
  `type_material_id` int NOT NULL,
  KEY `type_materiel_room` (`room_id`),
  KEY `type_materiel` (`type_material_id`) USING BTREE,
  CONSTRAINT `type_materiel` FOREIGN KEY (`type_material_id`) REFERENCES `type_material` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `type_materiel_room` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_type_material`
--

LOCK TABLES `room_type_material` WRITE;
/*!40000 ALTER TABLE `room_type_material` DISABLE KEYS */;
INSERT INTO `room_type_material` VALUES (1,1),(1,6),(2,2),(2,5),(3,1),(3,2),(4,3),(4,5),(5,4),(5,2),(7,2),(7,5),(8,1),(8,6),(9,2),(9,5),(10,1),(10,5);
/*!40000 ALTER TABLE `room_type_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_material`
--

DROP TABLE IF EXISTS `type_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_material`
--

LOCK TABLES `type_material` WRITE;
/*!40000 ALTER TABLE `type_material` DISABLE KEYS */;
INSERT INTO `type_material` VALUES (4,'Borne Arcade'),(3,'Casque VR'),(2,'Console'),(6,'Ecran 144Hz'),(1,'PC Gaming'),(5,'Television 4K');
/*!40000 ALTER TABLE `type_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `age` tinyint NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin','super_admin') COLLATE utf8mb4_general_ci NOT NULL,
  `registration_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,'a.martin@gmail.com','Antoine','MARTIN',28,'$2y$10$aAhashExample001aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-01 10:00:00'),(4,'c.dubois@hotmail.fr','Claire','DUBOIS',34,'$2y$10$aAhashExample002aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-03 11:30:00'),(5,'l.bernard@gmail.com','Lucas','BERNARD',22,'$2y$10$aAhashExample003aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-05 09:15:00'),(6,'m.thomas@yahoo.fr','Marie','THOMAS',19,'$2y$10$aAhashExample004aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-07 14:00:00'),(7,'p.robert@gmail.com','Pierre','ROBERT',45,'$2y$10$aAhashExample005aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-10 08:30:00'),(8,'e.richard@outlook.com','Emma','RICHARD',25,'$2y$10$aAhashExample006aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-12 16:45:00'),(9,'n.petit@gmail.com','Nicolas','PETIT',31,'$2y$10$aAhashExample007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-14 12:00:00'),(10,'j.leroy@gmail.com','Julien','LEROY',27,'$2y$10$aAhashExample008aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-16 10:20:00'),(11,'s.moreau@hotmail.fr','Sophie','MOREAU',23,'$2y$10$aAhashExample009aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-18 09:00:00'),(12,'r.simon@gmail.com','Romain','SIMON',38,'$2y$10$aAhashExample010aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-09-20 17:30:00'),(13,'a.laurent@gmail.com','Alice','LAURENT',21,'$2y$10$aAhashExample011aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-09-22 11:00:00'),(14,'k.lefebvre@yahoo.fr','Kevin','LEFEBVRE',26,'$2y$10$aAhashExample012aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-09-24 15:00:00'),(15,'i.garcia@gmail.com','Inès','GARCIA',29,'$2y$10$aAhashExample013aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-09-26 09:45:00'),(16,'b.martinez@outlook.com','Baptiste','MARTINEZ',17,'$2y$10$aAhashExample014aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-09-28 13:00:00'),(17,'c.david@gmail.com','Chloé','DAVID',33,'$2y$10$aAhashExample015aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-01 10:30:00'),(18,'t.bertrand@hotmail.fr','Thomas','BERTRAND',24,'$2y$10$aAhashExample016aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-03 14:20:00'),(19,'z.roux@gmail.com','Zoé','ROUX',20,'$2y$10$aAhashExample017aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-05 11:00:00'),(20,'m.vincent@gmail.com','Maxime','VINCENT',36,'$2y$10$aAhashExample018aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-07 09:00:00'),(21,'a.fournier@yahoo.fr','Anaïs','FOURNIER',22,'$2y$10$aAhashExample019aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-09 16:00:00'),(22,'g.morel@gmail.com','Guillaume','MOREL',40,'$2y$10$aAhashExample020aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-11 08:00:00'),(23,'c.girard@outlook.com','Camille','GIRARD',25,'$2y$10$aAhashExample021aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-13 10:00:00'),(24,'v.andre@gmail.com','Victor','ANDRE',30,'$2y$10$aAhashExample022aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-10-15 13:45:00'),(25,'l.lefevre@hotmail.fr','Léa','LEFEVRE',18,'$2y$10$aAhashExample023aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','user','2025-10-17 12:00:00'),(26,'f.mercier@gmail.com','François','MERCIER',50,'$2y$10$aAhashExample024aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-19 09:30:00'),(27,'j.dupont@gmail.com','Jade','DUPONT',23,'$2y$10$aAhashExample025aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','admin','2025-10-21 15:00:00'),(55,'j@gaminggrooms.fr','Julie','BENED',24,'$2y$12$VigNs4rsZg17bJjRrjYxj.Rqp6serN/PyEzCX43zdVKIDTz7TvGG2','user','2026-05-09 12:24:34'),(56,'j@gamingrooms.fr','Julie','Bened',24,'$2b$10$xMxC0zzB33xMbZI4aX1mdeC.BMf5bvwXHboalSPfhWu6ewOrTh/3a','super_admin','2026-06-01 16:05:27'),(57,'a@gamingrooms.fr','Antoine','Milo',26,'$2b$10$xMxC0zzB33xMbZI4aX1mdeC.BMf5bvwXHboalSPfhWu6ewOrTh/3a','admin','2026-06-01 16:05:27'),(58,'b@gamingrooms.fr','Benjamin','Dupuis',24,'$2b$10$xMxC0zzB33xMbZI4aX1mdeC.BMf5bvwXHboalSPfhWu6ewOrTh/3a','user','2026-06-01 16:05:27');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10 14:42:43
