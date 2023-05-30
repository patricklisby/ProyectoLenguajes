use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findClassification$$
CREATE PROCEDURE findClassification (_idClassification int)
begin 
select * from classification where idClassification = _idClassification;
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