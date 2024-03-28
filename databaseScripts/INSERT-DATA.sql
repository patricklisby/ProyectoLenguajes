USE gestioninventarios;

/*---------------------------ROL VALUES-------------------------------------*/
INSERT INTO role VALUES 
(1,"Admin"),
(2,"Cajero(a)"),
(3,"Oficinista"),
(4,"Bodeguero(a)");


/*---------------------------CLASSIFICATION VALUES-------------------------------------*/
INSERT INTO classification VALUES 
(1000,"Animales vivos"),
(1001,"Carnes"),
(1002,"Maríscos"),
(1003,"Lacteos y productos lácteos"),
(1004,"Plantas y floricultura"),
(1005,"Frutos y frutas comestibles"),
(1006,"Grasas y aceites vegetales/animales"),
(1007,"Carnes preparadas"),
(1008,"Azucares y confitería"),
(1009,"Preparación alimenticia diversa"),
(1010,"Bebidas, líquidos alcohólicos y vinagre"),
(1011,"Tabaco"),
(1012,"Productos minerales"),
(1013,"Productos químicos"),
(1014,"Aceites esenciales y resinoides"),
(1015,"Jabón, agentes de superficie orgánicos"),
(1016,"Materias albuminoideas"),
(1017,"Pólvora y explosivos"),
(1018,"Productos fotográficos o cinematográficos"),
(1019,"Productos diversos de industrias químicas"),
(1020,"Plástico y sus manufacturas"),
(1021,"Caucho y sus manufacturas"),
(1022,"Pieles y cueros"),
(1023,"Manufactura de cuero"),
(1024,"Pieles y cueros"),
(1025,"Manufactura de cuero"),
(1026,"Madera y derivados"),
(1027,"Corcho y sus manufacturas"),
(1028,"Papel y cartón"),
(1029,"Fibras sintéticas o aritificiales"),
(1030,"Calzado"),
(1031,"Sombreros"),
(1032,"Plumas y plumón preparados"),
(1033,"Manufacturas de piedra"),
(1034,"Metales comunies y manufacturas de estos metales"),
(1035,"Máquinas y materiales electrónicos"),
(1036,"Materiales de transporte"),
(1037,"Instrumentos de ótica"),
(1038,"Armas, municiones y sus partes"),
(1039,"Muebles"),
(1040,"Juguetes y artículos para recreo"),
(1041,"Objetos de arte o colección");

/*---------------------------SUPPLIER VALUES-------------------------------------*/
INSERT INTO supplier (idSupplier, supplierDescription, supplierPhone, supplierEmail, supplierAddress) VALUES
(1, 'Proveedor A', '1234567890', 'proveedora@example.com', 'Calle Principal 123'),
(2, 'Proveedor B', '1876543210', 'proveedorb@example.com', 'Avenida Secundaria 456'),
(3, 'Proveedor C', '1555555555', 'proveedorc@example.com', 'Plaza Central 789'),
(4, 'Proveedor D', '1998887777', 'proveedord@example.com', 'Carretera Principal 321'),
(5, 'Proveedor E', '1112223333', 'proveedore@example.com', 'Boulevard Secundario 654');

/*---------------------------CUSTOMER VALUES-------------------------------------*/
INSERT INTO customer (idCustomer, nameCustomer, firstLastNameCustomer, secondLastNameCustomer, customerEmail, customerPhone, customerAddress, admissionDate) VALUES
(1, 'Cliente A', 'ApellidoA1', 'ApellidoA2', 'clienteA@example.com', 1234567890, 'Calle Principal 123', CURRENT_TIMESTAMP),
(2, 'Cliente B', 'ApellidoB1', 'ApellidoB2', 'clienteB@example.com', 1876543210, 'Avenida Secundaria 456', CURRENT_TIMESTAMP),
(3, 'Cliente C', 'ApellidoC1', 'ApellidoC2', 'clienteC@example.com', 1555555555, 'Plaza Central 789', CURRENT_TIMESTAMP),
(4, 'Cliente D', 'ApellidoD1', 'ApellidoD2', 'clienteD@example.com', 1998887777, 'Carretera Principal 321', CURRENT_TIMESTAMP),
(5, 'Cliente E', 'ApellidoE1', 'ApellidoE2', 'clienteE@example.com', 1112223333, 'Boulevard Secundario 654', CURRENT_TIMESTAMP);

/*---------------------------PERSON VALUES-------------------------------------*/
INSERT INTO person (idPerson, idRol, namePerson, firstLastNamePerson, secondLastNamePerson, personEmail, personPhone, personAddress) VALUES
(1, 1, 'John', 'Doe', 'Smith', 'john.doe@example.com', 1234567890, '123 Main St'),
(2, 2, 'Jane', 'Smith', 'Johnson', 'jane.smith@example.com', 1876543210, '456 Elm St'),
(3, 1, 'Michael', 'Brown', 'Davis', 'michael.brown@example.com', 1555555555, '789 Oak St'),
(4, 3, 'Emily', 'Johnson', 'Anderson', 'emily.johnson@example.com', 1998887777, '321 Maple Ave'),
(5, 2, 'Daniel', 'Lee', 'Wilson', 'daniel.lee@example.com', 1112223333, '654 Pine St');

/*---------------------------CLASSIFICATION VALUES-------------------------------------*/
INSERT INTO classification (idClassification, classificationDescription) VALUES
(1, 'Clasificación A'),
(2, 'Clasificación B'),
(3, 'Clasificación C');

/*---------------------------PRODUCT VALUES-------------------------------------*/
INSERT INTO product (idProduct, idSupplier, idClassification, productDescription, priceProduct, expirationProduct) VALUES
(1, 1, 1, 'Producto A', 10.99, CURRENT_TIMESTAMP),
(2, 2, 2, 'Producto B', 19.99, CURRENT_TIMESTAMP),
(3, 3, 1, 'Producto C', 5.99, CURRENT_TIMESTAMP),
(4, 1, 3, 'Producto D', 8.50, CURRENT_TIMESTAMP),
(5, 2, 2, 'Producto E', 15.75, CURRENT_TIMESTAMP);

/*---------------------------WAREHOUSE VALUES-------------------------------------*/
INSERT INTO warehouse (idWareHouse, idProduct, cantItem) VALUES
(1, 1, 10),
(2, 2, 5),
(3, 3, 20),
(4, 1, 8),
(5, 2, 15);

/*---------------------------DETAIL VALUES-------------------------------------*/
INSERT INTO detail (idDetail, idCustomer, idProduct, cantItem) VALUES
(1, 1, 1, 5),
(2, 2, 2, 3),
(3, 3, 3, 10),
(4, 4, 1, 2),
(5, 5, 2, 8);

/*---------------------------BILLS VALUES-------------------------------------*/
INSERT INTO bills (idBill, idDetail, idPerson, dateGeneration) VALUES
(1, 1, 1, CURRENT_TIMESTAMP),
(2, 2, 2, CURRENT_TIMESTAMP),
(3, 3, 3, CURRENT_TIMESTAMP),
(4, 4, 4, CURRENT_TIMESTAMP),
(5, 5, 5, CURRENT_TIMESTAMP);