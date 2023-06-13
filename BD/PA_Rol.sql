use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findRol$$
CREATE PROCEDURE findRol (_idRol int)
begin 
select * from rol where idRol = _idRol;
end$$

DROP PROCEDURE IF EXISTS getRol$$
CREATE PROCEDURE getRol()
begin
select * from rol;
end$$


DROP PROCEDURE IF EXISTS filterRol$$
CREATE PROCEDURE filterRol (
    _parametros varchar(250), -- %idbill%&%idDetail%&%idPerson%&%dateGeneration%&
    _pagina SMALLINT UNSIGNED, 
    _cantRegs SMALLINT UNSIGNED)
begin
    SELECT strFilter(_parametros, 'idRol&rolDescription&') INTO @filtro;
    SELECT concat("SELECT * from rol where ", @filtro, " LIMIT ", 
        _pagina, ", ", _cantRegs) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP PROCEDURE IF EXISTS numRegsRol$$
CREATE PROCEDURE numRegsRol (
    _parametros varchar(250))
begin
    SELECT strFilter(_parametros, 'idRol&rolDescription&') INTO @filtro;
    SELECT concat("SELECT count(idRol) from rol where ", @filtro) INTO @sql;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
end$$

DROP FUNCTION IF EXISTS newRol$$
CREATE FUNCTION newRol (
_idRol int (25),
_rolDescription varchar(50))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idRol) into _cant from rol where idRol = _idRol;
    if _cant < 1 then
        insert into rol
            values (_idRol, _rolDescription);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editRol$$
CREATE FUNCTION editRol(
_idRol int (25),
_rolDescription varchar(50))
RETURNS INT(1) 
BEGIN
 DECLARE _cant INT;
 select count(idRol) into _cant from rol
 where idRol = _idRol;
    if _cant > 0 then
        update rol set
		idRol = _idRol,
		rolDescription = _rolDescription
 where idRol = _idRol;
 end if;
 return _cant;
 end$$
 
 DROP FUNCTION IF EXISTS deleteRol$$
 CREATE FUNCTION deleteRol(
 _idRol int(1))
 RETURNS INT (1)
 BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idRol) into _cant from rol where idRol = _idRol;
    if _cant > 0 then
        set _resp = 1;
        select count(idRol) into _cant from person where idRol = _idRol;
        if _cant = 0 then
            delete from rol where idRol = _idRol;
        else 
            -- select 2 into _resp;
            set _resp = 2;
        end if;
    end if;
    return _resp;
end$$

DELIMITER ;