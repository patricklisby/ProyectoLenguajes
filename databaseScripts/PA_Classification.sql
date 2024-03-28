use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findClassification$$
CREATE PROCEDURE findClassification (_idClassification int)
begin 
select * from classification where idClassification = _idClassification;
end$$

DROP PROCEDURE IF EXISTS filterClassification$$
CREATE PROCEDURE filterClassification (
    _parametros varchar(250), -- %idbill%&%idDetail%&%idPerson%&%dateGeneration%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED)
begin
    SELECT strFilter(_parametros, 'idClassification&classificationDescription&') INTO @filtro;
    SELECT concat("SELECT * from classification where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS numRegsClassification$$
CREATE PROCEDURE numRegsClassification (
    _parametros varchar(250))
begin
    SELECT strFilter(_parametros, 'idClassification&classificationDescription&') INTO @filtro;
    SELECT concat("SELECT count(idClassification) from classification where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS getClassification$$
CREATE PROCEDURE getClassification()
begin
select * from classification;
end$$

DROP FUNCTION IF EXISTS newClassification$$
CREATE FUNCTION newClassification (
_idClassification int (25),
_classificationDescription varchar(100))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idClassification) into _cant from classification where idClassification = _idClassification;
    if _cant < 1 then
        insert into classification
            values (_idClassification, _classificationDescription);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editClassification$$
CREATE FUNCTION editClassification(
_idClassification int (25),
_classificationDescription varchar(100))
RETURNS INT(1) 
BEGIN
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
 
 DROP FUNCTION IF EXISTS deleteClassification$$
 CREATE FUNCTION deleteClassification(
 _idClassification int(1))
 RETURNS INT (1)
 BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idClassification) into _cant from classification where idClassification = _idClassification;
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

DELIMITER ;