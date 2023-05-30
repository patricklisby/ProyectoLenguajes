use gestionInventarios;

DELIMITER $$ 
DROP PROCEDURE IF EXISTS findProduct$$
CREATE PROCEDURE findProduct (_idProduct int)
begin 
select * from product where idProduct = _idProduct;
end$$

DROP PROCEDURE IF EXISTS getProduct$$
CREATE PROCEDURE getProduct()
begin
select * from product;
end$$

DROP FUNCTION IF EXISTS newProduct$$
CREATE FUNCTION newProduct (
_idProduct int (25),
_idSupplier int(25),
_idClassification int(25),
_productDescription varchar(100),
_priceProduct double(9,2),
_expirationProduct date)
    RETURNS INT(1) 
begin
    declare _cant int;
    select count(idProduct) into _cant from product where idProduct = _idProduct;
    if _cant < 1 then
        insert into product
            values (_idProduct, _idSupplier,_idClassification, _productDescription,_priceProduct,_expirationProduct);
    end if;
    return _cant;
end$$

DROP FUNCTION IF EXISTS editProduct$$
CREATE FUNCTION editProduct(
_idProduct int (25),
_idSupplier int(25),
_idClassification int(25),
_productDescription varchar(50),
_priceProduct double(9,2),
_expirationProduct date)
RETURNS INT(1) 
BEGIN
 DECLARE _cant INT;
 select count(idProduct) into _cant from product
 where idProduct = _idProduct;
    if _cant > 0 then
        update product set
        idProduct =_idProduct,
        idSupplier = _idSupplier,
        idClassification = _idClassification,
		productDescription = _productDescription,
		priceProduct = _priceProduct,
        expirationProduct = _expirationProduct
 where idProduct = _idProduct;
 end if;
 return _cant;
 end$$
 
 DROP FUNCTION IF EXISTS deleteProduct$$
 CREATE FUNCTION deleteProduct(
 _idProduct int(1))
 RETURNS INT (1)
 BEGIN 
 declare _cant int;
    declare _resp int;
    set _resp = 0;
    select count(idProduct) into _cant from product where idProduct = _idProduct;
    if _cant > 0 then
        set _resp = 1;
        select count(idProduct) into _cant from warehouse where idProduct = _idProduct;
        if _cant = 0 then
        select count(idProduct) into _cant from detail where idProduct = _idProduct;
        if _cant = 0 then
            delete from product where idProduct = _idProduct;
        else 
            set _resp = 2;
            end if;
			end if;
		end if;
    return _resp;
end$$
DELIMITER ;