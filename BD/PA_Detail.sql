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
    _idDetail INT(25),
    _idCustomer INT(25),
    _idProduct INT(25),
    _cantItem INT(25)
)
    RETURNS INT(1) 
BEGIN
    DECLARE _cant INT;
    DECLARE _cantMaxItem INT;
    DECLARE _currentCantItem INT;
    
    SELECT COUNT(idProduct) INTO _cantMaxItem FROM product WHERE idProduct = _idProduct;
    
    IF _cantMaxItem > 0 THEN
        SELECT cantItem INTO _currentCantItem FROM warehouse WHERE idProduct = _idProduct;
        
        IF _currentCantItem - _cantItem >= 0 THEN
            UPDATE warehouse SET cantItem = _currentCantItem - _cantItem WHERE idProduct = _idProduct;
            
            SELECT COUNT(idDetail) INTO _cant FROM detail WHERE idDetail = _idDetail;
            IF _cant < 1 THEN
                INSERT INTO detail VALUES (_idDetail, _idCustomer, _idProduct, _cantItem);
            END IF;
        END IF;
    END IF;
    
    RETURN _cant;
END$$



DROP FUNCTION IF EXISTS editDetail$$
CREATE FUNCTION editDetail (
    _idDetail INT(25),
    _idCustomer INT(25),
    _idProduct INT(25),
    _cantItem INT(25)
)
    RETURNS INT(1) 
BEGIN
    DECLARE _cant INT;
    DECLARE _cantMaxItem INT;
    DECLARE _prevCantItem INT;
    
    -- Verificar si el idDetail existe en la tabla detail
    SELECT COUNT(idDetail) INTO _cant FROM detail WHERE idDetail = _idDetail;
    
    IF _cant > 0 THEN
        -- Obtener el valor actual de cantItem en la tabla detail
        SELECT cantItem INTO _prevCantItem FROM detail WHERE idDetail = _idDetail;
        
        -- Obtener el valor actual de cantItem en la tabla warehouse
        SELECT cantItem INTO _cantMaxItem FROM warehouse WHERE idProduct = _idProduct;
        
        -- Actualizar el detalle solo si el valor en warehouse es suficiente
        IF (_cantMaxItem + _prevCantItem) >= _cantItem THEN
            -- Actualizar el valor restante de cantItem en la tabla warehouse
            UPDATE warehouse SET cantItem = (_cantMaxItem + _prevCantItem - _cantItem) WHERE idProduct = _idProduct;
            
            -- Actualizar el detalle en la tabla detail con los nuevos valores proporcionados
            UPDATE detail SET
                idDetail = _idDetail,
                idCustomer = _idCustomer,
                idProduct = _idProduct,
                cantItem = _cantItem
            WHERE idDetail = _idDetail;
        END IF;
    END IF;
    
    RETURN _cant;
END$$


 
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