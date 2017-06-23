-- MySQL dump 10.13  Distrib 5.7.18, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: SEQ_SA_INFO
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dna_sample_sequencing_type`
--

LOCK TABLES `dna_sample_sequencing_type` WRITE;
/*!40000 ALTER TABLE `dna_sample_sequencing_type` DISABLE KEYS */;
INSERT INTO `dna_sample_sequencing_type` VALUES (1,1,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(2,2,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(3,3,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(4,4,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(5,5,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(6,6,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(7,7,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(8,8,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(9,10,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(10,12,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N',''),(11,13,'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','1'),(12,14,'N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','N','');
/*!40000 ALTER TABLE `dna_sample_sequencing_type` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rna_sample_sequencing_type`
--

LOCK TABLES `rna_sample_sequencing_type` WRITE;
/*!40000 ALTER TABLE `rna_sample_sequencing_type` DISABLE KEYS */;
INSERT INTO `rna_sample_sequencing_type` VALUES (1,1,'N','N','N','N','N','N','N','N','N',''),(2,2,'N','N','N','N','N','N','N','N','N',''),(3,3,'N','N','N','N','N','N','N','N','N',''),(4,10,'N','N','N','N','N','N','N','N','N',''),(5,12,'N','N','N','N','N','N','N','N','N',''),(6,13,'Y','Y','Y','Y','Y','Y','Y','Y','Y','1'),(7,14,'N','N','N','N','N','N','N','N','N','');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_other`
--

LOCK TABLES `sample_other` WRITE;
/*!40000 ALTER TABLE `sample_other` DISABLE KEYS */;
INSERT INTO `sample_other` VALUES (1,1,'Y','Y','Y','','N','N','','N','N'),(2,2,'N','N','N','','N','N','','N','N'),(3,3,'N','N','N','','N','N','','N','N'),(4,10,'N','N','N','','N','N','','N','N'),(5,12,'N','N','N','','N','N','','N','N'),(6,13,'N','N','N','','N','N','','N','N'),(7,14,'N','N','N','','N','N','','N','N');
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
  `project_log` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_number` (`project_number`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_project_master`
--

LOCK TABLES `sample_project_master` WRITE;
/*!40000 ALTER TABLE `sample_project_master` DISABLE KEYS */;
INSERT INTO `sample_project_master` VALUES (1,'ONMATH-101','测试','test','test','test','test','test','test','test','','陈佳林','项目完成','test','2016-04-09 22:47:08.609504','2016-04-09 22:47:08.609484: test create new project.\n\n2016-04-10 23:04:15.905796: test update this project.\n\n2016-04-10 23:05:00.323338: test created compare method.\n\n2016-04-10 23:18:10.335888: test update this project.\n\n2016-04-10 23:29:37.273268: 陈佳林 created compare method.\n\n2016-10-15 14:59:09.359214: test update this project.\n\n2017-06-03 10:41:20.002373: test update compare method.\n\n2017-06-03 10:42:48.232213: test update compare method.\n\n2017-06-03 10:48:44.528602: test update compare method.\n\n2017-06-03 10:51:43.414689: test update compare method.\n\n2017-06-03 22:25:40.526908: test update compare method.\n\n2017-06-03 22:46:35.914652: test update compare method.\n\n2017-06-03 22:47:31.171690: test update compare method.\n\n2017-06-03 23:03:42.199821: test update compare method.\n\n2017-06-03 23:48:50.297946: test update compare method.\n\n2017-06-04 00:24:39.366191: test update compare method.\n\n2017-06-04 00:26:03.505341: test update compare method.\n\n2017-06-04 00:40:28.765529: test update compare method.\n\n2017-06-04 01:43:10.268293: test update compare method.\n\n2017-06-04 01:58:46.462491: test update compare method.\n\n2017-06-04 02:00:24.133357: test update compare method.\n\n2017-06-04 09:24:51.050424: test update compare method.\n\n2017-06-07 04:46:18.136874: test update compare method.\n'),(2,'ONMATH-003','test project','huoqing','asdf','j','j','j','j','j','','陈佳林','等待送样','test','2016-04-11 12:34:14.634590','2016-04-11 12:34:14.634562: test create new project.\n'),(3,'ONMATH-002','1','1','1','1','1','1','1','1','','陈佳林','等待送样','test','2016-09-30 20:20:56.306588','2016-09-30 20:20:56.306568: test create new project.\n'),(4,'ONMATH-4','testttt','','tttetset','','','','','','','陈中旭','等待送样','test','2017-06-06 09:08:49.496732','2017-06-06 09:08:49.485660: test create new project.\n'),(5,'ONMATH-5','testttt','','tttetset','','','','','','','陈中旭','等待送样','test','2017-06-06 09:09:58.747149','2017-06-06 09:09:58.733298: test create new project.\n'),(6,'ONMATH-6','testttt','','tttetset','','','','','','','陈中旭','等待送样','test','2017-06-06 09:11:56.446408','2017-06-06 09:11:56.437606: test create new project.\n'),(7,'ONMATH-7','testttt','','tttetset','','','','','','','陈中旭','等待送样','test','2017-06-06 09:13:44.600725','2017-06-06 09:13:44.597018: test create new project.\n'),(8,'ONMATH-8','testttt','','tttetset','','','','','','','陈中旭','等待送样','test','2017-06-06 09:14:44.235154','2017-06-06 09:14:44.227553: test create new project.\n'),(9,'ONMATH-900','11231231','','213123123','','','','','','','陈中旭','等待送样','test','2017-06-06 09:16:55.687046','2017-06-06 09:16:55.679631: test create new project.\n'),(10,'ONMATH-10','11231231','','213123123','','','','','','','陈中旭','等待送样','test','2017-06-06 09:18:10.389281','2017-06-06 09:18:10.388938: test create new project.\n'),(12,'ONMATH-901','4444','','5555','','','','','','','陈中旭','等待送样','test','2017-06-06 09:26:42.492849','2017-06-06 09:26:42.492425: test create new project.\n'),(13,'ONMATH-902','rrrtttyyuu','1','werwerwerw','1','1','1','1','1','','陈中旭','等待送样','test','2017-06-07 04:38:21.359975','2017-06-07 04:38:21.300578: test create new project.\n'),(14,'ONMATH-903','test-test','test','test--test','','','','','','','陈中旭','等待送样','test','2017-06-07 04:41:18.758856','2017-06-07 04:41:18.758429: test create new project.\n');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_species`
--

LOCK TABLES `sample_species` WRITE;
/*!40000 ALTER TABLE `sample_species` DISABLE KEYS */;
INSERT INTO `sample_species` VALUES (1,1,'N','N','N','N',''),(2,2,'N','N','N','N',''),(3,3,'Y','N','N','N',''),(4,4,'N','N','N','N',''),(5,5,'N','N','N','N',''),(6,6,'N','N','N','N',''),(7,7,'N','N','N','N',''),(8,8,'N','N','N','N',''),(9,10,'N','N','N','N',''),(10,12,'N','N','N','N',''),(11,13,'Y','Y','Y','Y','1'),(12,14,'N','N','N','N','');
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_table`
--

LOCK TABLES `sample_table` WRITE;
/*!40000 ALTER TABLE `sample_table` DISABLE KEYS */;
INSERT INTO `sample_table` VALUES (20,1,'sample_name','狗','2','','3','','12','5','2','3','haha'),(21,1,'sample_name','狗','2','','4','','12','5','2','3',''),(22,1,'sample_name','狗','2','','7','','12','5','2','3',''),(23,1,'wwww','www','www','www','ww','w','w','w','w','w','w'),(24,1,'2','2','2','2','2','2','2','2','2','2','2'),(25,1,'1111','111','1','1','1','1','1','1','1','1','1'),(26,1,'3','3','3','3','3','3','3','3','3','3','3'),(36,12,'sample_name','狗','2','','3','','12','5','2','3','haha'),(37,12,'sample_name','狗','2','','2','','12','5','2','3',''),(38,12,'sample_name','狗','2','','2','','12','5','2','3',''),(39,12,'sample_name','狗','2','','3','','12','5','2','3',''),(40,12,'sample_name','狗','2','','4','','12','5','2','3',''),(41,13,'1','1','1','1','1','1','1','1','1','1','1'),(42,14,'sample_name','狗','2','','3','','12','5','2','3','haha'),(43,14,'sample_name','狗','2','','2','','12','5','2','3',''),(44,14,'sample_name','狗','2','','1','','12','5','2','3',''),(45,14,'sample_name','狗','2','','2','','12','5','2','3',''),(46,14,'sample_name','狗','2','','3','','12','5','2','3',''),(47,14,'sample_name','狗','2','','3','','12','5','2','3',''),(48,14,'sample_name','狗','2','','4','','12','5','2','3',''),(49,14,'sample_name','狗','2','','5','','12','5','2','3',''),(50,14,'sample_name','狗','2','','7','','12','5','2','3',''),(51,14,'dafadsf','猫','3','4','5','8','9','0','-','=','2');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_type`
--

LOCK TABLES `sample_type` WRITE;
/*!40000 ALTER TABLE `sample_type` DISABLE KEYS */;
INSERT INTO `sample_type` VALUES (1,1,'N','N','N','N','N','','N','N','N','N','N',''),(2,2,'N','N','N','N','N','','N','N','N','N','N',''),(3,3,'N','N','N','N','N','','N','N','N','N','N',''),(4,4,'N','N','N','N','N','','N','N','N','N','N',''),(5,5,'N','N','N','N','N','','N','N','N','N','N',''),(6,6,'N','N','N','N','N','','N','N','N','N','N',''),(7,7,'N','N','N','N','N','','N','N','N','N','N',''),(8,8,'N','N','N','N','N','','N','N','N','N','N',''),(9,10,'N','N','N','N','N','','N','N','N','N','N',''),(10,12,'N','N','N','N','N','','N','N','N','N','N',''),(11,13,'Y','Y','Y','Y','Y','1','Y','Y','Y','Y','Y','1'),(12,14,'N','N','N','N','N','','N','N','N','N','N','');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (1,'测试用户','','test','test','123456','',0,'','user','Y','','','2016-04-09 22:03:39','2016-04-09 22:03:39'),(2,'test','test','pbkdf2:sha1:1000$2f5P80F1$d2abf20af5d243894cbe24bfd1a3f50724ce080b','test@qq.com','13455556666','omath',0,'','user','Y','chinan','','2016-04-09 22:24:26','2017-06-04 09:12:43'),(3,'陈佳林','','chenjialin','839588325@qq.com','18628264390','',0,'','manager','Y','','','2016-04-09 22:45:19','2016-04-09 22:45:19'),(4,'zxchen','','2008','hugoczx@163.com','18215509986','',0,'','manager','Y','','','2016-04-12 07:41:12','2016-04-12 07:41:12'),(5,'mytest','','123','safsd','34153241','',0,'','user','Y','','','2016-04-12 07:42:44','2016-04-12 07:42:44'),(6,'bom','bom','11111111111','as@aa.com','13344445555','dfa',0,'','user','Y','畜牧/兽医学','','2016-10-15 12:41:15','2016-10-15 12:41:15');
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

-- Dump completed on 2017-06-23  1:56:44
