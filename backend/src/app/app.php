<?php

use DI\container;
use Slim\Factory\AppFactory;
require __DIR__ . '/../../vendor/autoload.php';

$cont_aux = new \DI\Container();

//Se inyecta
AppFactory::setContainer($cont_aux);

//Los dos puntos hace una instancia estatica
$app = AppFactory::create();

$app->add(new Tuupola\Middleware\JwtAuthentication([
    "secure" => false,
    "path" => ["/cliente"],
    "ignore" => [],
    "secret" => 'Alguna clave',
    "algorithm" => ["HS256","HS384"]
]));

//Las flecha instancia de forma dinamica
$container = $app -> getContainer();

//esta incluyendo todos los archivos antes de ejecutar
include_once 'routes.php';
include_once 'config.php';
include_once 'conexion.php';

$app->run();
?>