-- MySQL dump 10.13  Distrib 5.7.18, for Linux (x86_64)
--
-- Host: localhost    Database: SEQ_SA_INFO
-- ------------------------------------------------------
-- Server version	5.7.18-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `analysis_master`
--

DROP TABLE IF EXISTS `analysis_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `analysis_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `reference_genome` varchar(45) DEFAULT '',
  `compare_method` varchar(45) DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT '',
  `update_time` datetime DEFAULT NULL,
  `updated_by` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analysis_master`
--

LOCK TABLES `analysis_master` WRITE;
/*!40000 ALTER TABLE `analysis_master` DISABLE KEYS */;
INSERT INTO `analysis_master` VALUES (1,1,'Ensemble','两两全比较','2016-04-10 23:05:00','test','2017-06-07 04:46:18','test');
/*!40000 ALTER TABLE `analysis_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add rna sample sequencing type',1,'add_rnasamplesequencingtype'),(2,'Can change rna sample sequencing type',1,'change_rnasamplesequencingtype'),(3,'Can delete rna sample sequencing type',1,'delete_rnasamplesequencingtype'),(4,'Can add sample info detail',2,'add_sampleinfodetail'),(5,'Can change sample info detail',2,'change_sampleinfodetail'),(6,'Can delete sample info detail',2,'delete_sampleinfodetail'),(7,'Can add dna sample sequencing type',3,'add_dnasamplesequencingtype'),(8,'Can change dna sample sequencing type',3,'change_dnasamplesequencingtype'),(9,'Can delete dna sample sequencing type',3,'delete_dnasamplesequencingtype'),(10,'Can add compare table',4,'add_comparetable'),(11,'Can change compare table',4,'change_comparetable'),(12,'Can delete compare table',4,'delete_comparetable'),(13,'Can add sample species',5,'add_samplespecies'),(14,'Can change sample species',5,'change_samplespecies'),(15,'Can delete sample species',5,'delete_samplespecies'),(16,'Can add sample other',6,'add_sampleother'),(17,'Can change sample other',6,'change_sampleother'),(18,'Can delete sample other',6,'delete_sampleother'),(19,'Can add analysis master',7,'add_analysismaster'),(20,'Can change analysis master',7,'change_analysismaster'),(21,'Can delete analysis master',7,'delete_analysismaster'),(22,'Can add sample type',8,'add_sampletype'),(23,'Can change sample type',8,'change_sampletype'),(24,'Can delete sample type',8,'delete_sampletype'),(25,'Can add user info',9,'add_userinfo'),(26,'Can change user info',9,'change_userinfo'),(27,'Can delete user info',9,'delete_userinfo'),(28,'Can add sample project master',10,'add_sampleprojectmaster'),(29,'Can change sample project master',10,'change_sampleprojectmaster'),(30,'Can delete sample project master',10,'delete_sampleprojectmaster'),(31,'Can add sample packet information',11,'add_samplepacketinformation'),(32,'Can change sample packet information',11,'change_samplepacketinformation'),(33,'Can delete sample packet information',11,'delete_samplepacketinformation'),(34,'Can add sample table',12,'add_sampletable'),(35,'Can change sample table',12,'change_sampletable'),(36,'Can delete sample table',12,'delete_sampletable'),(37,'Can add log entry',13,'add_logentry'),(38,'Can change log entry',13,'change_logentry'),(39,'Can delete log entry',13,'delete_logentry'),(40,'Can add group',14,'add_group'),(41,'Can change group',14,'change_group'),(42,'Can delete group',14,'delete_group'),(43,'Can add permission',15,'add_permission'),(44,'Can change permission',15,'change_permission'),(45,'Can delete permission',15,'delete_permission'),(46,'Can add user',16,'add_user'),(47,'Can change user',16,'change_user'),(48,'Can delete user',16,'delete_user'),(49,'Can add content type',17,'add_contenttype'),(50,'Can change content type',17,'change_contenttype'),(51,'Can delete content type',17,'delete_contenttype'),(52,'Can add session',18,'add_session'),(53,'Can change session',18,'change_session'),(54,'Can delete session',18,'delete_session');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compare_table`
--

DROP TABLE IF EXISTS `compare_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compare_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) DEFAULT NULL,
  `number` varchar(45) DEFAULT '',
  `comparison_name` varchar(45) DEFAULT '',
  `sample_group1` varchar(45) DEFAULT '',
  `sample_group2` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compare_table`
--

LOCK TABLES `compare_table` WRITE;
/*!40000 ALTER TABLE `compare_table` DISABLE KEYS */;
INSERT INTO `compare_table` VALUES (4,2,'1','a vs b','',''),(5,2,'2','a vs c','',''),(6,2,'3','b vs c','',''),(99,1,'1','a vs c','a','c'),(100,1,'2','a vs d','a','d'),(101,1,'3','a vs f','a','f'),(102,1,'4','a vs g','a','g'),(103,1,'5','a vs t','a','t'),(104,1,'6','a vs u','a','u'),(105,1,'8','c vs f','c','f'),(106,1,'9','c vs g','c','g'),(107,1,'10','c vs t','c','t'),(108,1,'11','c vs u','c','u'),(109,1,'12','d vs f','d','f'),(110,1,'15','d vs u','d','u'),(111,1,'17','f vs t','f','t'),(112,1,'18','f vs u','f','u'),(113,1,'19','g vs t','g','t'),(114,1,'20','g vs u','g','u'),(115,1,'21','t vs u','t','u');
/*!40000 ALTER TABLE `compare_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (13,'admin','logentry'),(14,'auth','group'),(15,'auth','permission'),(16,'auth','user'),(17,'contenttypes','contenttype'),(7,'lims_app','analysismaster'),(4,'lims_app','comparetable'),(3,'lims_app','dnasamplesequencingtype'),(1,'lims_app','rnasamplesequencingtype'),(2,'lims_app','sampleinfodetail'),(6,'lims_app','sampleother'),(11,'lims_app','samplepacketinformation'),(10,'lims_app','sampleprojectmaster'),(5,'lims_app','samplespecies'),(12,'lims_app','sampletable'),(8,'lims_app','sampletype'),(9,'lims_app','userinfo'),(18,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2017-07-12 03:30:40.600684'),(2,'auth','0001_initial','2017-07-12 03:30:40.965202'),(3,'admin','0001_initial','2017-07-12 03:30:41.058305'),(4,'admin','0002_logentry_remove_auto_add','2017-07-12 03:30:41.097611'),(5,'contenttypes','0002_remove_content_type_name','2017-07-12 03:30:41.208266'),(6,'auth','0002_alter_permission_name_max_length','2017-07-12 03:30:41.226065'),(7,'auth','0003_alter_user_email_max_length','2017-07-12 03:30:41.260247'),(8,'auth','0004_alter_user_username_opts','2017-07-12 03:30:41.295657'),(9,'auth','0005_alter_user_last_login_null','2017-07-12 03:30:41.357521'),(10,'auth','0006_require_contenttypes_0002','2017-07-12 03:30:41.360852'),(11,'auth','0007_alter_validators_add_error_messages','2017-07-12 03:30:41.395658'),(12,'auth','0008_alter_user_username_max_length','2017-07-12 03:30:41.452646'),(13,'lims_app','0001_initial','2017-07-12 03:30:41.554545'),(14,'sessions','0001_initial','2017-07-12 03:30:41.582778');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dna_sample_sequencing_type`
--

DROP TABLE IF EXISTS `dna_sample_sequencing_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dna_sample_sequencing_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `resequencing` varchar(1) DEFAULT 'Y',
  `de_novo_sequencing` varchar(1) DEFAULT 'Y',
  `mate_pair` varchar(1) DEFAULT 'Y',
  `low_initial_weight_sequencing` varchar(1) DEFAULT 'Y',
  `exome` varchar(1) DEFAULT 'Y',
  `target_area_capture` varchar(1) DEFAULT 'Y',
  `purified` varchar(1) DEFAULT 'Y',
  `unpurified` varchar(1) DEFAULT 'Y',
  `d16s_rdna` varchar(1) DEFAULT 'Y',
  `rad` varchar(1) DEFAULT 'Y',
  `metagenome` varchar(1) DEFAULT 'Y',
  `chip_seq` varchar(1) DEFAULT 'Y',
  `dna_methylation_sequencing` varchar(1) DEFAULT 'Y',
  `rrbs` varchar(1) DEFAULT 'Y',
  `medip_seq` varchar(1) DEFAULT 'Y',
  `mitochondrial_dna_sequencing` varchar(1) DEFAULT 'Y',
  `dna_sample_sequencing_type_other` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dna_sample_sequencing_type`
--

LOCK TABLES `dna_sample_sequencing_type` WRITE;
/*!40000 ALTER TABLE `dna_sample_sequencing_type` DISABLE KEYS */;
INSERT INTO `dna_sample_sequencing_type` VALUES (1,1,'N','Y','N','N','N','N','N','N','N','N','N','N','N','N','N','Y',''),(2,2,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(3,3,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(4,4,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(5,5,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(6,6,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(7,7,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(8,8,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(9,10,'N','N','N','N','N','N','N','N','Y','N','N','N','N','N','N','N',''),(10,12,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(11,13,'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','1'),(12,14,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(13,17,'N','N','N','N','N','Y','N','N','N','N','N','N','N','N','N','N',''),(14,18,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(15,19,'N','N','N','N','N','Y','N','N','N','N','N','N','N','N','N','N',''),(16,20,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','');
/*!40000 ALTER TABLE `dna_sample_sequencing_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_log_table`
--

DROP TABLE IF EXISTS `project_log_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_log_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `action` varchar(45) DEFAULT NULL,
  `time` varchar(45) NOT NULL DEFAULT '',
  `manager` varchar(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_log_table`
--

LOCK TABLES `project_log_table` WRITE;
/*!40000 ALTER TABLE `project_log_table` DISABLE KEYS */;
INSERT INTO `project_log_table` VALUES (1,17,'create new project','2017-06-23 19:30:30.894540','test'),(2,1,'update this project','2017-06-23 19:51:38.088722','chencheng'),(3,2,'update this project','2017-06-23 19:51:58.351498','chencheng'),(4,3,'update this project','2017-06-23 19:53:47.993243','chencheng'),(6,17,'update this project','2017-06-23 19:55:54.008688','chencheng'),(7,12,'update this project','2017-06-23 20:00:26.456569','chencheng'),(8,10,'update this project','2017-06-23 20:15:52.566531','chencheng'),(9,17,'update this project','2017-06-23 20:17:03.770256','chencheng'),(10,18,'create new project','2017-07-14 11:29:39.204416','haha'),(11,2,'update this project','2017-07-17 10:08:05.323935','chencheng'),(12,19,'create new project','2017-07-17 11:11:43.202612','haha'),(13,20,'create new project','2017-07-17 15:28:01.674630','haha'),(14,20,'update this project','2017-07-17 15:43:37.633050','chencheng'),(15,10,'update sample table','2017-07-17 16:26:16.997284','chencheng'),(16,19,'update sample table','2017-07-17 16:34:34.168200','haha'),(17,10,'update this project','2017-07-17 16:51:06.519168','chencheng'),(18,20,'update sample table','2017-07-17 17:06:01.451036','chencheng');
/*!40000 ALTER TABLE `project_log_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rna_sample_sequencing_type`
--

DROP TABLE IF EXISTS `rna_sample_sequencing_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rna_sample_sequencing_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `three_eukaryotic_mrna_seq` varchar(1) DEFAULT 'Y',
  `mrna_seq_prokaryotae` varchar(1) DEFAULT 'Y',
  `low_initial_amount_of_eukaryotic_mrna_seq` varchar(1) DEFAULT 'Y',
  `strand_specific_transcriptome` varchar(1) DEFAULT 'Y',
  `incrna_seq` varchar(1) DEFAULT 'Y',
  `c_dna_transcriptome` varchar(1) DEFAULT 'Y',
  `cdna_single_cell_transcriptom` varchar(1) DEFAULT 'Y',
  `small_rna_sequencing` varchar(1) DEFAULT 'Y',
  `plasma_small_rna_equencing` varchar(1) DEFAULT 'Y',
  `rna_sample_sequencing_type_other` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rna_sample_sequencing_type`
--

LOCK TABLES `rna_sample_sequencing_type` WRITE;
/*!40000 ALTER TABLE `rna_sample_sequencing_type` DISABLE KEYS */;
INSERT INTO `rna_sample_sequencing_type` VALUES (1,1,'N','N','N','N','N','N','N','N','N',''),(2,2,'N','N','N','N','N','N','N','N','N',''),(3,3,'N','N','N','N','N','N','N','N','N',''),(4,10,'N','N','N','N','N','N','N','Y','N',''),(5,12,'N','N','N','N','N','N','N','N','Y',''),(6,13,'Y','Y','Y','Y','Y','Y','Y','Y','Y','1'),(7,14,'N','N','N','N','N','N','N','N','N',''),(8,17,'Y','N','N','N','N','N','N','Y','N',''),(9,18,'N','N','N','N','N','N','N','N','N',''),(10,19,'N','N','N','N','N','N','N','Y','N',''),(11,20,'N','N','N','N','Y','N','N','Y','N','');
/*!40000 ALTER TABLE `rna_sample_sequencing_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_info_detail`
--

DROP TABLE IF EXISTS `sample_info_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_info_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_alias` varchar(45) DEFAULT NULL,
  `project_id` int(11) NOT NULL,
  `sample_name` char(50) DEFAULT NULL,
  `product_num` char(50) DEFAULT NULL,
  `concentration` char(50) DEFAULT NULL,
  `volume` char(50) DEFAULT NULL,
  `od_260_or_280` char(50) DEFAULT NULL,
  `pre_time` char(50) DEFAULT NULL,
  `database_type` char(50) DEFAULT NULL,
  `data_quantity` char(50) DEFAULT NULL,
  `quality_inspection` char(50) DEFAULT NULL,
  `any_single_num` char(50) DEFAULT NULL,
  `sample_number` char(50) DEFAULT NULL,
  `library_name` char(50) DEFAULT NULL,
  `index_num` char(50) DEFAULT NULL,
  `index_sequence` char(50) DEFAULT NULL,
  `library_type` char(50) DEFAULT NULL,
  `length_of_gel` char(50) DEFAULT NULL,
  `fragment_length` char(50) DEFAULT NULL,
  `library_volume` char(50) DEFAULT NULL,
  `data_size` char(50) DEFAULT NULL,
  `wg_cid` char(50) DEFAULT NULL,
  `lib_id` char(50) DEFAULT NULL,
  `sample_type` char(50) DEFAULT NULL,
  `q_rcb` char(50) DEFAULT NULL,
  `od` char(50) DEFAULT NULL,
  `rin` char(50) DEFAULT NULL,
  `lib_size` char(50) DEFAULT NULL,
  `qty` char(50) DEFAULT NULL,
  `original_sample_name` char(50) DEFAULT NULL,
  `project_id_e` char(50) DEFAULT NULL,
  `yield` char(50) DEFAULT NULL,
  `reads` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sample_info_detail_id_uindex` (`id`),
  UNIQUE KEY `id_alias_UNIQUE` (`id_alias`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_info_detail`
--

LOCK TABLES `sample_info_detail` WRITE;
/*!40000 ALTER TABLE `sample_info_detail` DISABLE KEYS */;
INSERT INTO `sample_info_detail` VALUES (5,'OM-005',1,'测死','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''),(6,'OM-006',1,'399-45R','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''),(7,'OM-007',1,'12312df','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''),(8,'OM-008',1,'dafa34','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''),(9,'OM-009',1,'7867kk','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''),(10,'OM-0010',1,'ddd33','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','');
/*!40000 ALTER TABLE `sample_info_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_other`
--

DROP TABLE IF EXISTS `sample_other`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_other` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `reagent_kit_method` varchar(1) DEFAULT 'N',
  `ctab_method` varchar(1) DEFAULT 'N',
  `trizol_method` varchar(1) DEFAULT 'N',
  `other_method` varchar(45) DEFAULT '',
  `berry_handel` varchar(1) DEFAULT 'N',
  `ret_handel` varchar(1) DEFAULT 'N',
  `other_handel` varchar(45) DEFAULT '',
  `accord_contract` varchar(1) DEFAULT 'N',
  `special_needs` varchar(1) DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_other`
--

LOCK TABLES `sample_other` WRITE;
/*!40000 ALTER TABLE `sample_other` DISABLE KEYS */;
INSERT INTO `sample_other` VALUES (1,1,'Y','Y','Y','','N','N','','N','N'),(2,2,'N','N','N','','N','N','','N','N'),(3,3,'N','N','N','','N','N','','N','N'),(4,10,'N','N','N','','N','N','','N','N'),(5,12,'N','N','N','','N','N','','N','N'),(6,13,'N','N','N','','N','N','','N','N'),(7,14,'N','N','N','','N','N','','N','N'),(8,17,'N','N','N','','N','N','','N','N'),(9,18,'N','N','N','','N','N','','N','N'),(10,19,'N','N','N','','N','N','','N','N'),(11,20,'N','N','N','','N','N','','N','N');
/*!40000 ALTER TABLE `sample_other` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_packet_information`
--

DROP TABLE IF EXISTS `sample_packet_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_packet_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) DEFAULT NULL,
  `sample_id_alias` varchar(45) DEFAULT NULL,
  `sample_group` varchar(45) DEFAULT '',
  `repeated_experiment` varchar(45) DEFAULT '',
  `sample_name` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_packet_information`
--

LOCK TABLES `sample_packet_information` WRITE;
/*!40000 ALTER TABLE `sample_packet_information` DISABLE KEYS */;
INSERT INTO `sample_packet_information` VALUES (4,2,NULL,'a','',''),(5,2,NULL,'b','',''),(6,2,NULL,'c','',''),(67,1,'OM-006','a','','399-45R'),(68,1,'OM-006','c','','399-45R'),(69,1,'OM-007','d','','12312df'),(70,1,'OM-005','f','','测死'),(71,1,'OM-007','g','','12312df'),(72,1,'OM-007','t','','12312df'),(73,1,'OM-0010','u','','ddd33'),(74,1,'OM-007','y','','12312df');
/*!40000 ALTER TABLE `sample_packet_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_project_master`
--

DROP TABLE IF EXISTS `sample_project_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_project_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_number` varchar(45) NOT NULL,
  `project_name` text,
  `cust_organization` text,
  `cust_user` varchar(45) DEFAULT '',
  `email` varchar(45) DEFAULT '',
  `cust_tel` varchar(45) DEFAULT '',
  `sale_name` varchar(45) DEFAULT '',
  `sp_delive_date` varchar(45) DEFAULT '',
  `sp_sum` varchar(45) DEFAULT '',
  `species` varchar(45) DEFAULT '',
  `project_leader` varchar(45) DEFAULT '陈中旭',
  `status` varchar(45) DEFAULT '等待送样',
  `created_by` varchar(45) DEFAULT '',
  `create_time` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_number` (`project_number`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_project_master`
--

LOCK TABLES `sample_project_master` WRITE;
/*!40000 ALTER TABLE `sample_project_master` DISABLE KEYS */;
INSERT INTO `sample_project_master` VALUES (5,'ONMATH-5','testttt','','tttetset','','','','','','','chencheng','等待送样','test','2017-06-06 09:09:58.747149'),(6,'ONMATH-6','testttt','','tttetset','','','','','','','chencheng','等待送样','test','2017-06-06 09:11:56.446408'),(7,'ONMATH-7','testttt','','tttetset','','','','','','','chencheng','等待送样','test','2017-06-06 09:13:44.600725'),(8,'ONMATH-8','testttt','','tttetset','','','','','','','chencheng','等待送样','test','2017-06-06 09:14:44.235154'),(9,'ONMATH-900','11231231','','213123123','','','','','','','chencheng','等待送样','test','2017-06-06 09:16:55.687046'),(10,'ONMATH-10','11231231','','213123123','','','','','','','chencheng','等待送样','test','2017-06-06 09:18:10.389281'),(12,'ONMATH-901','4444','','5555','','','','','','','chencheng','等待送样','test','2017-06-06 09:26:42.492849'),(14,'ONMATH-903','test-test','test','test--test','','','','','','','chencheng','等待送样','test','2017-06-07 04:41:18.758856'),(15,'ONMATH-904','haha','','haha','','','','','','','chencheng','等待送样','test','2017-06-23 19:26:43.477432'),(16,'ONMATH-905','haha','','haha','','','','','','','chencheng','等待送样','test','2017-06-23 19:29:26.224983'),(17,'ONMATH-906','haha','','haha','','','','','','','chencheng','等待送样','test','2017-06-23 19:30:30.841083'),(19,'ONMATH-907','test_project1','四川农业大学','haha','haha@haha.com','','','','','','chencheng','等待送样','haha','2017-07-17 11:11:43.131307'),(20,'ONMATH-908','test_project2','四川农业大学','haha','haha@haha.com','','','','','鸡','chencheng','等待送样','haha','2017-07-17 15:28:01.598447');
/*!40000 ALTER TABLE `sample_project_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_species`
--

DROP TABLE IF EXISTS `sample_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_species` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `lyophillization` varchar(1) DEFAULT 'Y',
  `te_buffer` varchar(1) DEFAULT 'Y',
  `ddh2o` varchar(1) DEFAULT 'N',
  `depc` varchar(1) DEFAULT 'N',
  `sample_species_other` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_species`
--

LOCK TABLES `sample_species` WRITE;
/*!40000 ALTER TABLE `sample_species` DISABLE KEYS */;
INSERT INTO `sample_species` VALUES (1,1,'N','N','N','N',''),(2,2,'Y','N','N','N',''),(3,3,'Y','N','N','N',''),(4,4,'N','N','N','N',''),(5,5,'N','N','N','N',''),(6,6,'N','N','N','N',''),(7,7,'N','N','N','N',''),(8,8,'N','N','N','N',''),(9,10,'N','Y','N','N',''),(10,12,'N','N','N','N',''),(11,13,'Y','Y','Y','Y','1'),(12,14,'N','N','N','N',''),(13,17,'Y','N','N','N',''),(14,18,'N','N','N','N',''),(15,19,'Y','N','N','N',''),(16,20,'Y','N','N','N','');
/*!40000 ALTER TABLE `sample_species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_table`
--

DROP TABLE IF EXISTS `sample_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `sample_name` char(50) DEFAULT NULL,
  `sepcies` char(50) DEFAULT NULL,
  `product_num` char(50) DEFAULT NULL,
  `library_type` char(50) DEFAULT NULL,
  `concentration` char(50) DEFAULT NULL,
  `volume` char(50) DEFAULT NULL,
  `data_quantity` char(50) DEFAULT NULL,
  `fragment_length` char(50) DEFAULT NULL,
  `od_260_or_280` char(50) DEFAULT NULL,
  `od_260_or_230` char(50) DEFAULT NULL,
  `comment` char(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sample_table_id_uindex` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_table`
--

LOCK TABLES `sample_table` WRITE;
/*!40000 ALTER TABLE `sample_table` DISABLE KEYS */;
INSERT INTO `sample_table` VALUES (20,1,'sample_name','狗','2','','3','','12','5','2','3','haha'),(21,1,'sample_name','狗','2','','4','','12','5','2','3',''),(22,1,'sample_name','狗','2','','7','','12','5','2','3',''),(23,1,'wwww','www','www','www','ww','w','w','w','w','w','w'),(24,1,'2','2','2','2','2','2','2','2','2','2','2'),(25,1,'1111','111','1','1','1','1','1','1','1','1','1'),(26,1,'3','3','3','3','3','3','3','3','3','3','3'),(36,12,'sample_name','狗','2','','3','','12','5','2','3','haha'),(37,12,'sample_name','狗','2','','2','','12','5','2','3',''),(38,12,'sample_name','狗','2','','2','','12','5','2','3',''),(39,12,'sample_name','狗','2','','3','','12','5','2','3',''),(40,12,'sample_name','狗','2','','4','','12','5','2','3',''),(41,13,'1','1','1','1','1','1','1','1','1','1','1'),(42,14,'sample_name','狗','2','','3','','12','5','2','3','haha'),(43,14,'sample_name','狗','2','','2','','12','5','2','3',''),(44,14,'sample_name','狗','2','','1','','12','5','2','3',''),(45,14,'sample_name','狗','2','','2','','12','5','2','3',''),(46,14,'sample_name','狗','2','','3','','12','5','2','3',''),(47,14,'sample_name','狗','2','','3','','12','5','2','3',''),(48,14,'sample_name','狗','2','','4','','12','5','2','3',''),(49,14,'sample_name','狗','2','','5','','12','5','2','3',''),(50,14,'sample_name','狗','2','','7','','12','5','2','3',''),(51,14,'dafadsf','猫','3','4','5','8','9','0','-','=','2'),(152,10,'test1212','','','','','','','','','',''),(153,19,'test1','鸡','2','','','','','','','',''),(154,19,'test2','鸡','1','','','','','','','',''),(155,19,'test3','鸡','1','','','','','','','',''),(156,19,'test4','鸡','1','','','','','','','',''),(157,19,'test5','鸡','1','','','','','','','',''),(158,19,'test6','鸡','1','','','','','','','',''),(159,19,'test7','鸡','1','','','','','','','',''),(160,19,'test8','鸡','1','','','','','','','',''),(161,19,'test9','鸡','1','','','','','','','',''),(162,19,'test10','鸡','3','','','','','','','',''),(163,19,'test11','鸡','1','','','','','','','',''),(164,19,'test1','鸡','2','','','','','','','',''),(165,19,'test13','鸡','1','','','','','','','',''),(166,19,'test3','鸡','1','','','','','','','',''),(167,19,'test4','鸡','1','','','','','','','',''),(168,19,'test5','鸡','1','','','','','','','',''),(169,19,'test6','鸡','1','','','','','','','',''),(170,19,'test7','鸡','1','','','','','','','',''),(171,19,'test8','鸡','1','','','','','','','',''),(172,19,'test9','鸡','1','','','','','','','',''),(173,19,'test10','鸡','3','','','','','','','',''),(174,19,'test11','鸡','1','','','','','','','',''),(175,20,'test1','鸡','2','','','','','','','',''),(176,20,'test2','鸡','2','dna','','','','','','',''),(177,20,'test3','鸡','1','','','','','','','',''),(178,20,'test4','鸡','1','','','','','','','',''),(179,20,'test5','鸡','1','','','','','','','',''),(180,20,'test6','鸡','1','','','','','','','',''),(181,20,'test7','鸡','1','','','','','','','',''),(182,20,'test8','鸡','1','','','','','','','',''),(183,20,'test9','鸡','1','','','','','','','',''),(184,20,'test10','鸡','3','','','','','','','',''),(185,20,'test11','鸡','1','','','','','','','','');
/*!40000 ALTER TABLE `sample_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_type`
--

DROP TABLE IF EXISTS `sample_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `genomic_dna` varchar(1) DEFAULT 'Y',
  `chip_dna` varchar(1) DEFAULT 'Y',
  `pcr_fragment` varchar(1) DEFAULT 'Y',
  `free_dna` varchar(1) DEFAULT 'Y',
  `mitochondrial_dna` varchar(1) DEFAULT 'Y',
  `others_dna` varchar(45) DEFAULT '',
  `total_rna` varchar(1) DEFAULT 'Y',
  `to_ribosomal_rna` varchar(1) DEFAULT 'Y',
  `small_rna` varchar(1) DEFAULT 'Y',
  `c_dna` varchar(1) DEFAULT 'Y',
  `plasma_rna` varchar(1) DEFAULT 'Y',
  `other_rna` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_type`
--

LOCK TABLES `sample_type` WRITE;
/*!40000 ALTER TABLE `sample_type` DISABLE KEYS */;
INSERT INTO `sample_type` VALUES (1,1,'N','N','N','N','N','','N','N','N','N','N',''),(2,2,'N','N','N','N','N','','N','N','N','N','N',''),(3,3,'N','N','N','N','N','','N','N','N','N','N',''),(4,4,'N','N','N','N','N','','N','N','N','N','N',''),(5,5,'N','N','N','N','N','','N','N','N','N','N',''),(6,6,'N','N','N','N','N','','N','N','N','N','N',''),(7,7,'N','N','N','N','N','','N','N','N','N','N',''),(8,8,'N','N','N','N','N','','N','N','N','N','N',''),(9,10,'N','N','N','N','N','','N','N','N','N','N',''),(10,12,'N','N','N','N','N','','N','N','N','N','N',''),(11,13,'Y','Y','Y','Y','Y','1','Y','Y','Y','Y','Y','1'),(12,14,'N','N','N','N','N','','N','N','N','N','N',''),(13,17,'N','N','N','N','N','','N','N','N','N','N',''),(14,18,'N','N','N','N','N','','N','N','N','N','N',''),(15,19,'N','N','N','N','N','','N','Y','N','N','N',''),(16,20,'N','N','N','N','N','','N','N','Y','N','N','');
/*!40000 ALTER TABLE `sample_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `customer_name` varchar(45) DEFAULT '',
  `password` varchar(200) NOT NULL,
  `e_mail` varchar(45) DEFAULT '',
  `tel` varchar(45) DEFAULT '',
  `company` varchar(100) DEFAULT '',
  `age` int(5) unsigned DEFAULT '0',
  `sex` varchar(2) DEFAULT '',
  `role` varchar(45) DEFAULT 'user',
  `status` varchar(1) DEFAULT 'Y',
  `field` varchar(100) DEFAULT '',
  `notes` varchar(200) DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (1,'测试用户','','test','test','123456','',0,'','user','Y','','','2016-04-09 22:03:39','2016-04-09 22:03:39'),(2,'test','test','pbkdf2:sha1:1000$2f5P80F1$d2abf20af5d243894cbe24bfd1a3f50724ce080b','test@qq.com','13455556666','omath',0,'','user','Y','chinan','','2016-04-09 22:24:26','2017-06-04 09:12:43'),(3,'陈佳林','','chenjialin','839588325@qq.com','18628264390','',0,'','manager','Y','','','2016-04-09 22:45:19','2016-04-09 22:45:19'),(4,'zxchen','','2008','hugoczx@163.com','18215509986','',0,'','manager','Y','','','2016-04-12 07:41:12','2016-04-12 07:41:12'),(5,'mytest','','123','safsd','34153241','',0,'','user','Y','','','2016-04-12 07:42:44','2016-04-12 07:42:44'),(6,'bom','bom','11111111111','as@aa.com','13344445555','dfa',0,'','user','Y','畜牧/兽医学','','2016-10-15 12:41:15','2016-10-15 12:41:15'),(7,'chencheng','陈诚','pbkdf2:sha1:1000$XEWnS32p$f91cbf1dbbc9a815b17fa6ba6c01afe2ee59fe60','291552579@qq.com','18583994795','onmath',0,'','manager','Y','','','2017-06-23 17:57:35','2017-06-23 17:57:35'),(8,'haha','haha','pbkdf2:sha1:1000$7qN4GCS7$0eabc89794017715c21c98ebd08bc65be2bbfdbe','haha@haha.com','13548019589','haha',0,'','user','Y','生物学','','2017-07-14 11:24:41','2017-07-14 11:24:41');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-17 17:32:31
