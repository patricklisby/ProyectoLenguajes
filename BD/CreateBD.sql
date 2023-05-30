
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

DROP DATABASE IF EXISTS gestionInventarios;
CREATE DATABASE gestionInventarios DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE gestionInventarios;


/*---------------------------ROL TABLE-------------------------------------*/

DROP TABLE IF EXISTS role;
CREATE TABLE role(
idRol int (5) NOT NULL,
rolDescription varchar(50) NOT NULL COLLATE utf8_spanish_ci,
PRIMARY KEY (idRol)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------PERSON TABLE-------------------------------------*/

DROP TABLE IF EXISTS person;
CREATE TABLE person(
idPerson int (25) NOT NULL, 
idRol int NOT NULL,
namePerson varchar(50) NOT NULL COLLATE utf8_spanish_ci,
firstLastNamePerson varchar(50) NOT NULL COLLATE utf8_spanish_ci,
secondLastNamePerson varchar(50) NOT NULL COLLATE utf8_spanish_ci,
personEmail varchar(100) NOT NULL COLLATE utf8_spanish_ci,
personPhone int(50) NOT NULL,
personAddress varchar(100) NOT NULL COLLATE utf8_spanish_ci,
PRIMARY KEY(idPerson),
FOREIGN KEY(idRol) REFERENCES role(idRol)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------SUPPLIER TABLE-------------------------------------*/

DROP TABLE IF EXISTS supplier;
CREATE TABLE supplier(
idSupplier int(25) NOT NULL,
supplierDescription varchar(50) NOT NULL COLLATE utf8_spanish_ci,
supplierPhone varchar(25) NOT NULL COLLATE utf8_spanish_ci,
supplierEmail varchar(50) NOT NULL COLLATE utf8_spanish_ci,
supplierAddress varchar(100) NOT NULL COLLATE utf8_spanish_ci,
PRIMARY KEY(idSupplier)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;



/*---------------------------CLASSIFICATION RELATION TABLE-------------------------------------*/

DROP TABLE IF EXISTS classification;
CREATE TABLE classification(
idClassification int NOT NULL,
classificationDescription varchar(100) NOT NULL COLLATE utf8_spanish_ci,
PRIMARY KEY (idClassification)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------PRODUCTS TABLE-------------------------------------*/
DROP TABLE IF EXISTS product;
CREATE TABLE product(
idProduct int (25) NOT NULL,
idSupplier int NOT NULL,
idClassification int NOT NULL,
productDescription varchar (50) NOT NULL COLLATE utf8_spanish_ci,
priceProduct double(9,2) NOT NULL,
expirationProduct Datetime,
PRIMARY KEY (idProduct),
FOREIGN KEY(idSupplier) REFERENCES supplier(idSupplier),
FOREIGN KEY(idClassification) REFERENCES classification(idClassification)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------WAREHOUSE TABLE-------------------------------------*/

DROP TABLE IF EXISTS wareHouse;
CREATE TABLE wareHouse(
idWareHouse int (25) NOT NULL,
idProduct int NOT NULL,
cantItem int(25) NOT NULL,
PRIMARY KEY(idWareHouse),
FOREIGN KEY(idProduct) REFERENCES product(idProduct)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------CUSTOMER TABLE-------------------------------------*/

DROP TABLE IF EXISTS customer;
CREATE TABLE customer(
idCustomer int (25) NOT NULL,
nameCustomer varchar(50) NOT NULL COLLATE utf8_spanish_ci,
firstLastNameCustomer varchar(50) NOT NULL COLLATE utf8_spanish_ci,
secondLastNameCustomer varchar(50) NOT NULL COLLATE utf8_spanish_ci,
customerEmail varchar(100) NOT NULL COLLATE utf8_spanish_ci,
customerPhone int(50) NOT NULL,
customerAddress varchar(250) NOT NULL COLLATE utf8_spanish_ci,
admissionDate Datetime DEFAULT NOW(),
PRIMARY KEY(idCustomer)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------DETAILS RELATION TABLE-------------------------------------*/

DROP TABLE IF EXISTS detail;
CREATE TABLE detail(
idDetail int(25) NOT NULL,
idCustomer int(25) NOT NULL,
idProduct int(25) NOT NULL,
cantItem int (25) NOT NULL,
PRIMARY KEY (idDetail),
FOREIGN KEY(idCustomer) REFERENCES customer(idCustomer),
FOREIGN KEY(idProduct) REFERENCES product(idProduct)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;


/*---------------------------BILLS TABLE-------------------------------------*/

DROP TABLE IF EXISTS bills;
CREATE TABLE bills(
idBill int(25) NOT NULL,
idDetail int NOT NULL,
idPerson int NOT NULL,
dateGeneration Datetime DEFAULT NOW(),
PRIMARY KEY(idBill),
FOREIGN KEY(idDetail) REFERENCES detail(idDetail),
FOREIGN KEY(idPerson) REFERENCES person(idPerson)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

COMMIT;#end of transaction
