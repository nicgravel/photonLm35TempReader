CREATE SCHEMA `templogger` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `templogger`.`temperature` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` DECIMAL(10,2) NULL,
  `timestamp` TIMESTAMP NULL,
  `sensorId` VARCHAR(45) NULL,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  PRIMARY KEY (`id`));

