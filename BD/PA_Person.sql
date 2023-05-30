use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findPerson$$
CREATE PROCEDURE findPerson (_idPerson int)
begin 
select * from person where idPerson = _idPerson;
end$$

DROP PROCEDURE IF EXISTS getPerson$$
CREATE PROCEDURE getPerson()
begin
select * from person;
end$$

DROP FUNCTION IF EXISTS newPerson$$
CREATE FUNCTION newPerson (
_idPerson int (25),
_idRol int (25),
_namePerson varchar(50),
_firstLastNamePerson varchar(50),
_secondLastNamePerson varchar(50),
_personEmail varchar(100),
_personPhone int(50),
_personAddress varchar(250))
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idPerson) into _cant from person where idPerson = _idPerson;
    if _cant < 1 then
        insert into person
            values (_idPerson, _idRol, _namePerson, _firstLastNamePerson, _secondLastNamePerson,
            _personEmail, _personPhone, _personAddress);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editPerson$$
CREATE FUNCTION editPerson(
_idPerson int (25),
_idRol int (25),
_namePerson varchar(50),
_firstLastNamePerson varchar(50),
_secondLastNamePerson varchar(50),
_personEmail varchar(100),
_personPhone int(50),
_personAddress varchar(250)
)
RETURNS INT(1) 
BEGIN
 DECLARE _cant INT;
 select count(idPerson) into _cant from person
 where idPerson= _idPerson;
    if _cant > 0 then
        update person set
		idPerson = _idPerson,
        idRol = _idRol,
		namePerson = _namePerson,
		firstLastNamePerson = _firstLastNamePerson,
		secondLastNamePerson = _secondLastNamePerson,
		personEmail = _personEmail,
		personPhone = _personPhone,
		personAddress = _personAddress
 where idPerson = _idPerson;
 end if;
 return _cant;
 end$$
 
 DROP FUNCTION IF EXISTS deletePerson$$
 CREATE FUNCTION deletePerson(
 _idPerson int(1))
 RETURNS INT (1)
 BEGIN 
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
DELIMITER ;