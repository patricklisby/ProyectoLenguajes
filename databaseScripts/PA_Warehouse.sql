use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findWareHouse$$
CREATE PROCEDURE findWareHouse (_idWareHouse int)
begin 
select * from warehouse where idWareHouse = _idWareHouse;
end$$

DROP PROCEDURE IF EXISTS getWareHouse$$
CREATE PROCEDURE getWareHouse()
begin
select * from warehouse;
end$$

DROP PROCEDURE IF EXISTS filterWarehouse$$
CREATE PROCEDURE filterWarehouse (
    _parametros varchar(250), -- %idbill%&%idDetail%&%idPerson%&%dateGeneration%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED)
begin
    SELECT strFilter(_parametros, 'idWareHouse&idProduct&') INTO @filtro;
    SELECT concat("SELECT * from warehouse where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS numRegsWarehouse$$
CREATE PROCEDURE numRegsWarehouse (
    _parametros varchar(250))
begin
    SELECT strFilter(_parametros,  'idWarehouse&idProduct&') INTO @filtro;
    SELECT concat("SELECT count(idWarehouse) from Warehouse where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP FUNCTION IF EXISTS newWareHouse$$
CREATE FUNCTION newWareHouse (
_idWareHouse int (25),
_idProduct int(25),
_cantItem int(25))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idWareHouse) into _cant from warehouse where idWareHouse = _idWareHouse;
    if _cant < 1 then
        insert into warehouse
            values (_idWareHouse, _idProduct, _cantItem);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editWareHouse$$
CREATE FUNCTION editWareHouse(
_idWareHouse int (25),
_idProduct int(25),
_cantItem int(25))
RETURNS INT(1) 
BEGIN
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
 
 DROP FUNCTION IF EXISTS deleteWareHouse$$
 CREATE FUNCTION deleteWareHouse(
 _idWarehouse int(1))
 RETURNS INT (1)
 BEGIN 
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

DELIMITER ;