<?php
header('Allow: GET, POST, OPTIONS, PUT, DELETE, PATCH');
// Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Origin: *');

// Permitir los métodos HTTP GET, POST, PUT y DELETE
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH');
// Permitir los encabezados de contenido y autorización
header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Request-Width, Content-Type, Accept, Access-Control-Request-Method, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    die('Metodo no permitido');
}
//Incluir o importar otra clase
require_once "../src/app/app.php";
?>