use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findBill$$
CREATE PROCEDURE findBill (_idBill int)
begin 
select * from bills where idBill = _idBill;
end$$

DROP PROCEDURE IF EXISTS filterBill$$
CREATE PROCEDURE filterBill (
    _parametros varchar(250), -- %idbill%&%idDetail%&%idPerson%&%dateGeneration%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED)
begin
    SELECT strFilter(_parametros, 'idBill&idDetail&idPerson&') INTO @filtro;
    SELECT concat("SELECT * from bills where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS numRegsBill$$
CREATE PROCEDURE numRegsBill (
    _parametros varchar(250))
begin
    SELECT strFilter(_parametros, 'idBill&idDetail&idPerson&') INTO @filtro;
    SELECT concat("SELECT count(idBill) from bills where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS getBill$$
CREATE PROCEDURE getBill()
begin
select * from bills;
end$$

DROP FUNCTION IF EXISTS newBill$$
CREATE FUNCTION newBill (
_idBill int (25),
_idDetail int(25),
_idPerson int(25),
_dateGeneration datetime
)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idBill) into _cant from bills where idBill = _idBill;
    if _cant < 1 then
        insert into bills
            values (_idBill, _idDetail, _idPerson, _dateGeneration);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editBill$$
CREATE FUNCTION editBill(
_idBill int (25),
_idDetail int(25),
_idPerson int(25)
)
RETURNS INT(1) 
BEGIN
 DECLARE _cant INT;
 select count(idBill) into _cant from bills
 where idBill = _idBill;
    if _cant > 0 then
    update bills set
    idBill = _idBill,
    idDetail = _idDetail,
	idPerson = _idPerson
	where idBill = _idBill;
 end if;
 return _cant;
 end$$
 
 DROP FUNCTION IF EXISTS deleteBill$$
 CREATE FUNCTION deleteBill(
 _idBill int(1))
 RETURNS INT (1)
 BEGIN 
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

DELIMITER ;