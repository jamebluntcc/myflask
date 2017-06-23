CREATE TABLE `analysis_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `refer_ensemble` varchar(1) DEFAULT 'N',
  `refer_ncbi` varchar(1) DEFAULT 'N',
  `refer_ucsc` varchar(1) DEFAULT 'N',
  `refer_null` varchar(1) DEFAULT 'N',
  `refer_Prov_customer` varchar(45) DEFAULT '',
  `compare_method` varchar(45) DEFAULT '',
  `create_time` datetime DEFAULT NULL,
  `created_by` varchar(45) DEFAULT '',
  `update_time` datetime DEFAULT NULL,
  `updated_by` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `compare_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) DEFAULT NULL,
  `number` varchar(45) DEFAULT '',
  `comparison_name` varchar(45) DEFAULT '',
  `sample1` varchar(45) DEFAULT '',
  `sample2` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sample_info_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  UNIQUE KEY `sample_info_detail_id_uindex` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `sample_packet_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) DEFAULT NULL,
  `sample_group` varchar(45) DEFAULT '',
  `repeated_experiment` varchar(45) DEFAULT '',
  `sample_name` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sample_project_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_number` int(11) DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sample_species` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `lyophillization` varchar(1) DEFAULT 'Y',
  `te_buffer` varchar(1) DEFAULT 'Y',
  `ddh2o` varchar(1) DEFAULT 'N',
  `depc` varchar(1) DEFAULT 'N',
  `sample_species_other` varchar(45) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `e_mail` varchar(45) DEFAULT '',
  `tel` varchar(45) DEFAULT '',
  `company` varchar(45) DEFAULT '',
  `age` int(5) unsigned DEFAULT '0',
  `sex` varchar(2) DEFAULT '',
  `role` varchar(45) DEFAULT 'user',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `SEQ_SA_INFO`.`user_info`
CHANGE COLUMN `company` `company` VARCHAR(100) NULL DEFAULT '' ,
ADD COLUMN `field` VARCHAR(100) NULL DEFAULT '' AFTER `status`;


ALTER TABLE `SEQ_SA_INFO`.`user_info`
ADD COLUMN `notes` VARCHAR(200) NULL DEFAULT '' AFTER `field`;


ALTER TABLE `SEQ_SA_INFO`.`user_info`
ADD COLUMN `customer_name` VARCHAR(45) NULL DEFAULT '' AFTER `username`;


### 2017-05-30
CREATE TABLE `sample_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sample_id` char(50) NOT NULL ,
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
  UNIQUE KEY `sample_table_id_uindex` (`id`),
  UNIQUE KEY `sample_table_sample_id_uindex` (`sample_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

### 2017-06-03
ALTER TABLE `SEQ_SA_INFO`.`analysis_master`
DROP COLUMN `refer_Prov_customer`,
DROP COLUMN `refer_null`,
DROP COLUMN `refer_ucsc`,
DROP COLUMN `refer_ncbi`,
DROP COLUMN `refer_ensemble`,
ADD COLUMN `reference_genome` VARCHAR(45) NULL DEFAULT '' AFTER `project_id`;

ALTER TABLE `SEQ_SA_INFO`.`sample_packet_information`
ADD COLUMN `sample_id` INT(11) NULL DEFAULT NULL AFTER `master_id`;

ALTER TABLE `SEQ_SA_INFO`.`sample_packet_information`
CHANGE COLUMN `sample_id` `sample_id` VARCHAR(45) NULL DEFAULT NULL ;


ALTER TABLE `SEQ_SA_INFO`.`sample_info_detail`
ADD COLUMN `id_alias` VARCHAR(45) NULL DEFAULT NULL AFTER `id`,
ADD UNIQUE INDEX `id_alias_UNIQUE` (`id_alias` ASC);


ALTER TABLE `SEQ_SA_INFO`.`sample_packet_information`
CHANGE COLUMN `sample_id` `sample_id_alias` VARCHAR(45) NULL DEFAULT NULL ;

ALTER TABLE `SEQ_SA_INFO`.`compare_table`
CHANGE COLUMN `sample1` `sample_group1` VARCHAR(45) NULL DEFAULT '' ,
CHANGE COLUMN `sample2` `sample_group2` VARCHAR(45) NULL DEFAULT '' ;

ALTER TABLE `SEQ_SA_INFO`.`user_info`
CHANGE COLUMN `password` `password` VARCHAR(200) NOT NULL ;

ALTER TABLE `SEQ_SA_INFO`.`sample_project_master`
CHANGE COLUMN `project_number` `project_number` VARCHAR(45) NOT NULL ;
#2017-06-23
CREATE TABLE `SEQ_SA_INFO`.`project_log_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `action` VARCHAR(45) NULL,
  `time` VARCHAR(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `project_id_UNIQUE` (`project_id` ASC));

  ALTER TABLE `SEQ_SA_INFO`.`sample_project_master`
  DROP COLUMN `sale_name`;
