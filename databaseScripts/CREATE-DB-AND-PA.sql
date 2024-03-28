-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 12, 2023 at 04:12 AM
-- Server version: 10.10.2-MariaDB
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestioninventarios`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `findBill`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findBill` (`_idBill` INT)   begin 
select * from bills where idBill = _idBill;
end$$

DROP PROCEDURE IF EXISTS `findClassification`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findClassification` (`_idClassification` INT)   begin 
select * from classification where idClassification = _idClassification;
end$$

DROP PROCEDURE IF EXISTS `findCustomer`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findCustomer` (`_idCustomer` INT)   begin 
select * from customer where idCustomer = _idCustomer;
end$$

DROP PROCEDURE IF EXISTS `findDetail`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findDetail` (`_idDetail` INT)   begin 
select * from detail where idDetail = _idDetail;
end$$

DROP PROCEDURE IF EXISTS `findPerson`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findPerson` (`_idPerson` INT)   begin 
select * from person where idPerson = _idPerson;
end$$

DROP PROCEDURE IF EXISTS `findProduct`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findProduct` (`_idProduct` INT)   begin 
select * from product where idProduct = _idProduct;
end$$

DROP PROCEDURE IF EXISTS `findRol`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findRol` (`_idRol` INT)   begin 
select * from role where idRol = _idRol;
end$$

DROP PROCEDURE IF EXISTS `findSupplier`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findSupplier` (`_idSupplier` INT)   begin 
select * from supplier where idSupplier = _idSupplier;
end$$

DROP PROCEDURE IF EXISTS `findWareHouse`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `findWareHouse` (`_idWareHouse` INT)   begin 
select * from warehouse where idWareHouse = _idWareHouse;
end$$

DROP PROCEDURE IF EXISTS `getBill`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getBill` ()   begin
select * from bills;
end$$

DROP PROCEDURE IF EXISTS `getClassification`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getClassification` ()   begin
select * from classification;
end$$

DROP PROCEDURE IF EXISTS `getCustomer`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCustomer` ()   begin
select * from customer;
end$$

DROP PROCEDURE IF EXISTS `getDetail`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getDetail` ()   begin
select * from detail;
end$$

DROP PROCEDURE IF EXISTS `getPerson`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPerson` ()   begin
select * from person;
end$$

DROP PROCEDURE IF EXISTS `getProduct`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getProduct` ()   begin
select * from product;
end$$

DROP PROCEDURE IF EXISTS `getRol`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getRol` ()   begin
select * from role;
end$$

DROP PROCEDURE IF EXISTS `getSupplier`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSupplier` ()   begin
select * from supplier;
end$$

DROP PROCEDURE IF EXISTS `getWareHouse`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getWareHouse` ()   begin
select * from warehouse;
end$$

--
-- Functions
--
DROP FUNCTION IF EXISTS `deleteBill`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteBill` (`_idBill` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idBill) into _cant from bills where idBill = _idBill;
    if _cant > 0 then
        set _resp = 1;
            delete from bills where idBill = _idBill;
        else 
            set _resp = 2;
	   end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteClassification`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteClassification` (`_idClassification` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idClassification) into _cant from product where idClassification = _idClassification;
    if _cant > 0 then
        set _resp = 1;
        select count(idClassification) into _cant from product where idClassification =  _idClassification;
        if _cant = 0 then
            delete from classification where idClassification = _idClassification;
        else 
            set _resp = 2;
            end if;
	   end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteCustomer`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteCustomer` (`_idCustomer` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idCustomer) into _cant from customer where idCustomer = _idCustomer;
    if _cant > 0 then
        set _resp = 1;
            delete from customer where idCustomer = _idCustomer;
        else 
            set _resp = 2;
	   end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteDetail`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteDetail` (`_idDetail` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idDetail) into _cant from detail where idDetail = _idDetail;
    if _cant > 0 then
        set _resp = 1;
        select count(idDetail) into _cant from bills where idDetail = _idDetail;
        if _cant = 0 then
            delete from detail where idDetail = _idDetail;
        else 
            set _resp = 2;
            end if;
	   end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deletePerson`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deletePerson` (`_idPerson` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idPerson) into _cant from person where idPerson = _idPerson;
    if _cant > 0 then
        set _resp = 1;
        select count(idPerson) into _cant from bills where idPerson = _idPerson;
        if _cant = 0 then
            delete from person where idPerson = _idPerson;
        else 
            set _resp = 2;
            end if;
	   end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteProduct`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteProduct` (`_idProduct` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idProduct) into _cant from product where idProduct = _idProduct;
    if _cant > 0 then
        set _resp = 1;
        select count(idProduct) into _cant from warehouse where idProduct = _idProduct;
        if _cant = 0 then
        select count(idProduct) into _cant from detail where idPerson = _idProduct;
        if _cant = 0 then
            delete from supplier where idProduct = _idProduct;
        else 
            set _resp = 2;
            end if;
			end if;
		end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteRol`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteRol` (`_idRol` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idRol) into _cant from role where idRol = _idRol;
    if _cant > 0 then
        set _resp = 1;
        select count(idRol) into _cant from person where idRol = _idRol;
        if _cant = 0 then
            delete from role where idRol = _idRol;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteSupplier`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteSupplier` (`_idSupplier` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idSupplier) into _cant from supplier where idSupplier = _idSupplier;
    if _cant > 0 then
        set _resp = 1;
        select count(idSupplier) into _cant from producto where idSupplier = _idSupplier;
        if _cant = 0 then
            delete from supplier where idSupplier = _idSupplier;
        else 
            set _resp = 2;
	   end if;
       end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `deleteWareHouse`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `deleteWareHouse` (`_idWarehouse` INT(1)) RETURNS INT(1)  BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idWareHouse) into _cant from warehouse where idWareHouse = _idWareHouse;
    if _cant > 0 then
        set _resp = 1;
            delete from warehouse where idWareHouse = _idWareHouse;
        else 
            set _resp = 2;
	   end if;
    return _resp;
end$$

DROP FUNCTION IF EXISTS `editBill`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editBill` (`_idBill` INT(25), `_idDetail` INT(25), `_idPerson` INT(25)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(_idBill) into _cant from bills
 where _idBill = __idBill;
    if _cant > 0 then
    update bills set
    idBill = _idBill,
    idDetail = _idDetail,
	idPerson = _idPerson
 where idBill = _idBill;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editClassification`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editClassification` (`_idClassification` INT(25), `_classificationDescription` INT(25)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idClassification) into _cant from classification
 where idClassification = _idClassification;
    if _cant > 0 then
    update classification set
    idClassification = _idClassification,
	classificationDescription = _classificationDescription 
 where idClassification = _idClassification;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editCustomer`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editCustomer` (`_idCustomer` INT(25), `_nameCustomer` VARCHAR(50), `_firstLastNameCustomer` VARCHAR(50), `_secondLastNameCustomer` VARCHAR(50), `_customerEmail` VARCHAR(100), `_customerPhone` INT(50), `_customerAddress` VARCHAR(250)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idCustomer) into _cant from customer
 where idCustomer = _idCustomer;
    if _cant > 0 then
        update customer set
		idCustomer = _idCustomer,
		nameCustomer = _nameCustomer,
		firstLastNameCustomer = _firstLastNameCustomer,
		secondLastNameCustomer = _secondLastNameCustomer,
		customerEmail = _customerEmail,
		customerPhone = _customerPhone,
		customerAddress = _customerAddress
 where idCustomer = _idCustomer;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editDetail`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editDetail` (`_idDetail` INT(25), `_idCostumer` INT(25), `_idProduct` INT(25), `_cantItem` INT(25)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idDetail) into _cant from detail
 where idDetail = _idDetail;
    if _cant > 0 then
    update detail set
    idDetail = _idDetail,
    idCustomer = _idCustomer,
	idProduct = _idProduct,
    cantItem = _cantItem
 where idDetail = _idDetail;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editPerson`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editPerson` (`_idPerson` INT(25), `_namePerson` VARCHAR(50), `_firstLastNamePerson` VARCHAR(50), `_secondLastNamePerson` VARCHAR(50), `_personEmail` VARCHAR(100), `_personPhone` INT(50), `_personAddress` VARCHAR(250), `_idRol` INT(25)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idPerson) into _cant from person
 where idPerson= _idPerson;
    if _cant > 0 then
        update cliente set
		idPerson = _idPerson,
		namePerson = _namePerson,
		firstLastNamePerson = _firstLastNamePerson,
		secondLastNamePerson = _secondLastNamePerson,
		personEmail = _personEmail,
		personPhone = _personPhone,
		personAddress = _personAddress,
        idRol = _idRol
 where idPerson = _idPerson;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editProduct`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editProduct` (`_idProduct` INT(25), `_idSupplier` INT(25), `_idClassification` INT(25), `_productDescription` VARCHAR(50), `_priceProduct` DOUBLE(9,2)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idProduct) into _cant from product
 where idProduct = _idProduct;
    if _cant > 0 then
        update product set
        idProduct =_idProduct,
        idSupplier = _idSupplier,
        idClassification = _idClassification,
		productDescription = _productDescription,
		priceProduct = _priceProduct
 where idProduct = _idProduct;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editRol`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editRol` (`_idRol` INT(25), `_rolDescription` VARCHAR(50)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idRol) into _cant from role
 where idRol = _idRol;
    if _cant > 0 then
        update role set
		idRol = _idRol,
		rolDescription = _rolDescription
 where idRol = _idRol;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editSupplier`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editSupplier` (`_idSupplier` INT(25), `_supplierDescription` VARCHAR(50), `_supplierPhone` VARCHAR(50), `_supplierEmail` VARCHAR(50), `_supplierAddress` VARCHAR(100)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idSupplier) into _cant from supplier
 where idSupplier = _idSupplier;
    if _cant > 0 then
        update supplier set
		 idSupplier =_idSupplier,
		supplierDescription = _supplierDescription,
		supplierPhone = _supplierPhone,
		supplierEmail = _supplierEmail,
		supplierAddress = _supplierAddress
 where idSupplier = _idSupplier;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `editWareHouse`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `editWareHouse` (`_idWareHouse` INT(25), `_idProduct` INT(25), `_cantItem` INT(25)) RETURNS INT(1)  BEGIN
 DECLARE _cant INT;
 select count(idWareHouse) into _cant from warehouse
 where idWareHouse = _idWareHouse;
    if _cant > 0 then
    update warehouse set
    idWareHouse = _idWareHouse,
	idProduct = _idProduct,
    cantItem = _cantItem
 where idWareHouse = _idWareHouse;
 end if;
 return _cant;
 end$$

DROP FUNCTION IF EXISTS `newBill`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newBill` (`_idBill` INT(25), `_idDetail` INT(25), `_idPerson` INT(25)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idBill) into _cant from bills where idBill = _idBill;
    if _cant < 1 then
        insert into bills
            values (_idBill, _idDetail, _idPerson);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newClassification`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newClassification` (`_idClassification` INT(25), `_classificationDescription` INT(25)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idClassification) into _cant from classification where idClassification = _idClassification;
    if _cant < 1 then
        insert into classification
            values (_idClassification, _classificationDescription);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newCustomer`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newCustomer` (`_idCustomer` INT(25), `_nameCustomer` VARCHAR(50), `_firstLastNameCustomer` VARCHAR(50), `_secondLastNameCustomer` VARCHAR(50), `_customerEmail` VARCHAR(100), `_customerPhone` INT(50), `_customerAddress` VARCHAR(250)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idCustomer) into _cant from customer where idCustomer = _idCustomer;
    if _cant < 1 then
        insert into customer
            values (_idCustomer, _nameCustomer, _firstLastNameCustomer, _secondLastNameCustomer,
            _customerEmail, _customerPhone, _customerAddress);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newDetail`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newDetail` (`_idDetail` INT(25), `_idCostumer` INT(25), `_idProduct` INT(25), `_cantItem` INT(25)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idDetail) into _cant from detail where idDetail = _idDetail;
    if _cant < 1 then
        insert into detail
            values (_idDetail, _idCostumer, _idProduct, _cantItem);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newPerson`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newPerson` (`_idPerson` INT(25), `_namePerson` VARCHAR(50), `_firstLastNamePerson` VARCHAR(50), `_secondLastNamePerson` VARCHAR(50), `_personEmail` VARCHAR(100), `_personPhone` INT(50), `_personAddress` VARCHAR(250), `_idRol` INT(25)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idPerson) into _cant from person where idPerson = _idPerson;
    if _cant < 1 then
        insert into person
            values (_idPerson, _namePerson, _firstLastNamePerson, _secondLastNamePerson,
            _personEmail, _personPhone, _personAddress, _idRol);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newProduct`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newProduct` (`_idProduct` INT(25), `_idSupplier` INT(25), `_idClassification` INT(25), `_productDescription` VARCHAR(50), `_priceProduct` DOUBLE(9,2)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idProduct) into _cant from product where idProduct = _idProduct;
    if _cant < 1 then
        insert into product
            values (_idProduct, _idSupplier,_idClassification, _productDescription,_priceProduct);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newRol`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newRol` (`_idRol` INT(25), `_rolDescription` VARCHAR(50)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idRol) into _cant from role where idRol = _idRol;
    if _cant < 1 then
        insert into role
            values (_idRol, _rolDescription);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newSupplier`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newSupplier` (`_idSupplier` INT(25), `_supplierDescription` VARCHAR(50), `_supplierPhone` VARCHAR(50), `_supplierEmail` VARCHAR(50), `_supplierAddress` VARCHAR(100)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idSupplier) into _cant from supplier where idSupplier = _idSupplier;
    if _cant < 1 then
        insert into supplier
            values (_idSupplier, _supplierDescription,_supplierPhone, _supplierEmail,_supplierAddress);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS `newWareHouse`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `newWareHouse` (`_idWareHouse` INT(25), `_idProduct` INT(25), `_cantItem` INT(25)) RETURNS INT(1)  begin
    declare _cant int;
    select count(idWareHouse) into _cant from warehouse where idWareHouse = _idWareHouse;
    if _cant < 1 then
        insert into warehouse
            values (_idWareHouse, _idProduct, _cantItem);
    end if;
    return _cant;
end$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
CREATE TABLE IF NOT EXISTS `bills` (
  `idBill` int(25) NOT NULL,
  `idDetail` int(11) NOT NULL,
  `idPerson` int(11) NOT NULL,
  `dateGeneration` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idBill`),
  KEY `idDetail` (`idDetail`),
  KEY `idPerson` (`idPerson`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classification`
--

DROP TABLE IF EXISTS `classification`;
CREATE TABLE IF NOT EXISTS `classification` (
  `idClassification` int(11) NOT NULL,
  `classificationDescription` varchar(100) NOT NULL,
  PRIMARY KEY (`idClassification`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `idCustomer` int(25) NOT NULL,
  `nameCustomer` varchar(50) NOT NULL,
  `firstLastNameCustomer` varchar(50) NOT NULL,
  `secondLastNameCustomer` varchar(50) NOT NULL,
  `customerEmail` varchar(100) NOT NULL,
  `customerPhone` int(50) NOT NULL,
  `customerAddress` varchar(250) NOT NULL,
  `admissionDate` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idCustomer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detail`
--

DROP TABLE IF EXISTS `detail`;
CREATE TABLE IF NOT EXISTS `detail` (
  `idDetail` int(25) NOT NULL,
  `idCustomer` int(25) NOT NULL,
  `idProduct` int(25) NOT NULL,
  `cantItem` int(25) NOT NULL,
  PRIMARY KEY (`idDetail`),
  KEY `idCustomer` (`idCustomer`),
  KEY `idProduct` (`idProduct`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
CREATE TABLE IF NOT EXISTS `person` (
  `idPerson` int(25) NOT NULL,
  `idRol` int(11) NOT NULL,
  `namePerson` varchar(50) NOT NULL,
  `firstLastNamePerson` varchar(50) NOT NULL,
  `secondLastNamePerson` varchar(50) NOT NULL,
  `personEmail` varchar(100) NOT NULL,
  `personPhone` int(50) NOT NULL,
  `personAddress` varchar(100) NOT NULL,
  PRIMARY KEY (`idPerson`),
  KEY `idRol` (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `idProduct` int(25) NOT NULL,
  `idSupplier` int(11) NOT NULL,
  `idClassification` int(11) NOT NULL,
  `productDescription` varchar(50) NOT NULL,
  `priceProduct` double(9,2) NOT NULL,
  `expirationProduct` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idProduct`),
  KEY `idSupplier` (`idSupplier`),
  KEY `idClassification` (`idClassification`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `idRol` int(5) NOT NULL,
  `rolDescription` varchar(50) NOT NULL,
  PRIMARY KEY (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE IF NOT EXISTS `supplier` (
  `idSupplier` int(25) NOT NULL,
  `supplierDescription` varchar(50) NOT NULL,
  `supplierPhone` varchar(25) NOT NULL,
  `supplierEmail` varchar(50) NOT NULL,
  `supplierAddress` varchar(100) NOT NULL,
  PRIMARY KEY (`idSupplier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
CREATE TABLE IF NOT EXISTS `warehouse` (
  `idWareHouse` int(25) NOT NULL,
  `idProduct` int(11) NOT NULL,
  `cantItem` int(25) NOT NULL,
  PRIMARY KEY (`idWareHouse`),
  KEY `idProduct` (`idProduct`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`idDetail`) REFERENCES `detail` (`idDetail`),
  ADD CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`idPerson`) REFERENCES `person` (`idPerson`);

--
-- Constraints for table `detail`
--
ALTER TABLE `detail`
  ADD CONSTRAINT `detail_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`),
  ADD CONSTRAINT `detail_ibfk_2` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`);

--
-- Constraints for table `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `person_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `role` (`idRol`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`idSupplier`) REFERENCES `supplier` (`idSupplier`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`idClassification`) REFERENCES `classification` (`idClassification`);

--
-- Constraints for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD CONSTRAINT `warehouse_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
