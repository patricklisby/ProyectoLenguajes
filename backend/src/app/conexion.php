<?php
use Psr\Container\ContainerInterface;

//Conexion a la base de datos
$container ->set('bd', function(ContainerInterface $c){
    $conf = $c ->get('config_bd');
    $opc =[
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        //fetch extrae los datos de tipo objeto
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
    ];
    //driver de conexion 
    $dsn = "mysql:host = $conf->host;dbname=$conf->bd;charset = $conf->charset";
    try{
        $con = new PDO($dsn, $conf -> usr, $conf -> pass, $opc);
    } catch (PDOException $e) {
        print "Error" . $e ->getMessage() . "<br>"; //quitar en produccion
        die();
    }
    return $con;
});
?>