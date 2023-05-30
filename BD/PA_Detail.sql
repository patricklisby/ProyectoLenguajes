use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findDetail$$
CREATE PROCEDURE findDetail (_idDetail int)
begin 
select * from detail where idDetail = _idDetail;
end$$

DROP PROCEDURE IF EXISTS getDetail$$
CREATE PROCEDURE getDetail()
begin
select * from detail;
end$$

DROP FUNCTION IF EXISTS newDetail$$
CREATE FUNCTION newDetail (
_idDetail int (25),
_idCostumer int(25),
_idProduct int(25),
_cantItem int (25)
)
    RETURNS INT(1) 
begin
    declare _cant int;
    declare _cantMaxItem int;
    select count(idDetail) into _cant from detail where idDetail = _idDetail;
    if _cant < 1 then
    select cantItem into _cantMaxItem from warehouse where idProduct = _idProduct;
    if _cantMaxItem >= _cantItem then
        insert into detail
            values (_idDetail, _idCostumer, _idProduct, _cantItem);

    end if;
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editDetail$$
CREATE FUNCTION editDetail(
_idDetail int (25),
_idCustomer int(25),
_idProduct int(25),
_cantItem int (25)
)
RETURNS INT(1) 
BEGIN
 DECLARE _cant INT;
 DECLARE _cantMaxItem int;
 select count(idDetail) into _cant from detail
 where idDetail = _idDetail;
    if _cant > 0 then
    select cantItem into _cantMaxItem from warehouse where idProduct = _idProduct;
    if _cantMaxItem >= _cantItem then
    update detail set
    idDetail = _idDetail,
    idCustomer = _idCustomer,
	idProduct = _idProduct,
    cantItem = _cantItem
 where idDetail = _idDetail;
 end if;
 end if;
 return _cant;
 end$$
 
 DROP FUNCTION IF EXISTS deleteDetail$$
 CREATE FUNCTION deleteDetail(
 _idDetail int(1))
 RETURNS INT (1)
 BEGIN 
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

DELIMITER ;