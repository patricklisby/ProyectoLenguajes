use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findSupplier$$
CREATE PROCEDURE findSupplier (_idSupplier int)
begin 
select * from supplier where idSupplier = _idSupplier;
end$$

DROP PROCEDURE IF EXISTS getSupplier$$
CREATE PROCEDURE getSupplier()
begin
select * from supplier;
end$$

DROP FUNCTION IF EXISTS newSupplier$$
CREATE FUNCTION newSupplier (
_idSupplier int (25),
_supplierDescription varchar(50),
_supplierPhone varchar(50),
_supplierEmail varchar(50),
_supplierAddress varchar(100))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idSupplier) into _cant from supplier where idSupplier = _idSupplier;
    if _cant < 1 then
        insert into supplier
            values (_idSupplier, _supplierDescription,_supplierPhone, _supplierEmail,_supplierAddress);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editSupplier$$
CREATE FUNCTION editSupplier(
_idSupplier int (25),
_supplierDescription varchar(50),
_supplierPhone varchar(50),
_supplierEmail varchar(50),
_supplierAddress varchar(100))
RETURNS INT(1) 
BEGIN
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
 
 DROP FUNCTION IF EXISTS deleteSupplier$$
 CREATE FUNCTION deleteSupplier(
 _idSupplier int(1))
 RETURNS INT (1)
 BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idSupplier) into _cant from supplier where idSupplier = _idSupplier;
    if _cant > 0 then
        set _resp = 1;
        select count(idSupplier) into _cant from product where idSupplier = _idSupplier;
        if _cant = 0 then
            delete from supplier where idSupplier = _idSupplier;
        else 
            set _resp = 2;
	   end if;
       end if;
    return _resp;
end$$
DELIMITER ;