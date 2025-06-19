-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema certificadora
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema certificadora
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `certificadora` DEFAULT CHARACTER SET utf8 ;
USE `certificadora` ;

-- -----------------------------------------------------
-- Table `certificadora`.`doacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificadora`.`doacao` (
  `doa_id` INT NOT NULL AUTO_INCREMENT,
  `doa_donorName` VARCHAR(100) NULL,
  `doa_mark` VARCHAR(100) NULL,
  `doa_type` VARCHAR(100) NULL,
  `doa_hipoalergenico` TINYINT NULL,
  `doa_flow` VARCHAR(100) NULL,
  `doa_indication` VARCHAR(100) NULL,
  `doa_amount` INT NULL,
  `doa_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doa_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `certificadora`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificadora`.`user` (
  `user_username` VARCHAR(100) NOT NULL,
  `user_password` VARCHAR(100) NULL,
  `user_name` VARCHAR(100) NULL,
  `user_active` TINYINT(1) NULL,
  `user_permision` TINYINT(1) NULL,
  PRIMARY KEY (`user_username`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
