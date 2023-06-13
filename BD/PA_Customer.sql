use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findCustomer$$
CREATE PROCEDURE findCustomer (_idCustomer int)
begin 
select * from customer where idCustomer = _idCustomer;
end$$

DROP PROCEDURE IF EXISTS filterCustomer$$
CREATE PROCEDURE filterCustomer (
    _parametros varchar(250), -- %idbill%&%idDetail%&%idPerson%&%dateGeneration%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED)
begin
    SELECT strFilter(_parametros, 'idCustomer&nameCustomer&firstLastNameCustomer&secondLastNameCustomer&') INTO @filtro;
    SELECT concat("SELECT * from customer where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS numRegsCustomer$$
CREATE PROCEDURE numRegsCustomer (
    _parametros varchar(250))
begin
    SELECT strFilter(_parametros, 'idCustomer&nameCustomer&firstLastNameCustomer') INTO @filtro;
    SELECT concat("SELECT count(idCustomer) from customer where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS getCustomer$$
CREATE PROCEDURE getCustomer()
begin
select * from customer;
end$$

DROP FUNCTION IF EXISTS newCustomer$$
CREATE FUNCTION newCustomer (
_idCustomer int (25),
_nameCustomer varchar(50),
_firstLastNameCustomer varchar(50),
_secondLastNameCustomer varchar(50),
_customerEmail varchar(100),
_customerPhone int(50),
_customerAddress varchar(250),
_admissionDate Datetime)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idCustomer) into _cant from customer where idCustomer = _idCustomer;
    if _cant < 1 then
        insert into customer
            values (_idCustomer, _nameCustomer, _firstLastNameCustomer, _secondLastNameCustomer,
            _customerEmail, _customerPhone, _customerAddress, _admissionDate);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editCustomer$$
CREATE FUNCTION editCustomer(
_idCustomer int (25),
_nameCustomer varchar(50),
_firstLastNameCustomer varchar(50),
_secondLastNameCustomer varchar(50),
_customerEmail varchar(100),
_customerPhone int(50),
_customerAddress varchar(250),
_admissionDate Datetime) 
RETURNS INT(1) 
BEGIN
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
		customerAddress = _customerAddress,
        admissionDate = _admissionDate
 where idCustomer = _idCustomer;
 end if;
 return _cant;
 end$$
 
 DROP FUNCTION IF EXISTS deleteCustomer$$
 CREATE FUNCTION deleteCustomer(
 _idCustomer int(1))
 RETURNS INT (1)
 BEGIN 
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
DELIMITER ;