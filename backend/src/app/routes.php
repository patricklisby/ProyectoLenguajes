<?php
namespace App\controller;

use Composer\Autoload\ClassLoader;
use Slim\Routing\RouteCollectorProxy;

$app->group('/person', function(RouteCollectorProxy $person){
    $person->patch('/rol/{id}', Person::class . ':changeRole');

    $person->group('/passw', function(RouteCollectorProxy $passw){
        //No usar verbos en los endpoints
        $passw->patch('/change/{id}', Person::class . ':changePassw');
        $passw->patch('/reset/{id}', Person::class . ':resetPassw');
    });//GroupPassw
});//Group persons

$app->group('/sesion', function(RouteCollectorProxy $sesion){
    $sesion->patch('/login/{id}', Sesion::class . ':login');
    $sesion->patch('/logout/{id}', Sesion::class . ':logout');
    $sesion->patch('/reload/{id}', Sesion::class . ':reload');
});//Grupo sesion

//listo
$app->group('/rol', function(RouteCollectorProxy $rol){
    $rol->get('/{page}/{limit}', Rol::class . ':filter' );//Listo
    $rol->get('', Rol::class . ':numRegs');//Listo
    $rol->get('/data', Rol::class . ':get');//Listo
    $rol->get('/{id}', Rol::class . ':find');//Listo 
    $rol->post('', Rol::class . ':create');//Listo
    //modifica toda la estructura
    $rol->put('/{id}', Rol::class . ':edit');//ListogetDataget
    $rol->delete('/{id}', Rol::class . ':delete');//Listo
});

$app->group('/bills', function(RouteCollectorProxy $bills){
    $bills->get('/{page}/{limit}', Bills::class . ':filter' );//Listo
    $bills->get('', Bills::class . ':numRegs');//Listo
    $bills->get('/data', Bills::class . ':get');//Listo
    $bills->get('/{id}', Bills::class . ':find');//Listo 
    $bills->post('', Bills::class . ':create');//Listo
    //modifica toda la estructura
    $bills->put('/{id}', Bills::class . ':edit');//Listo
    $bills->delete('/{id}', Bills::class . ':delete');//Listo
});

$app->group('/classification', function(RouteCollectorProxy $classification){
    $classification->get('/{page}/{limit}', Classification::class . ':filter' );//Listo
    $classification->get('', Classification::class . ':numRegs');//Listo
    $classification->get('/data', Classification::class . ':get');//Listo
    $classification->get('/{id}', Classification::class . ':find');//Listo 
    $classification->post('', Classification::class . ':create');//Listo
    //modifica toda la estructura
    $classification->put('/{id}', Classification::class . ':edit');//Listo
    $classification->delete('/{id}', Classification::class . ':delete');//Listo
});

$app->group('/detail', function(RouteCollectorProxy $detail){
    $detail->get('/{page}/{limit}', Detail::class . ':filter' );//Listo
    $detail->get('', Detail::class . ':numRegs');//Listo
    $detail->get('/data', Detail::class . ':get');//Listo
    $detail->get('/{id}', Detail::class . ':find');//Listo 
    $detail->post('', Detail::class . ':create');//Listo
    //modifica toda la estructura
    $detail->put('/{id}', Detail::class . ':edit');//Listo
    $detail->delete('/{id}', Detail::class . ':delete');//Listo
});

$app->group('/customer', function(RouteCollectorProxy $customer){
    $customer->get('/{page}/{limit}', Customer::class . ':filter' );//Listo
    $customer->get('', Customer::class . ':numRegs');//Listo
    $customer->get('/data', Customer::class . ':get');//Listo
    $customer->get('/{id}', Customer::class . ':find');//Listo 
    $customer->post('', Customer::class . ':create');//Listo
    //modifica toda la estructura
    $customer->put('/{id}', Customer::class . ':edit');//Listo
    $customer->delete('/{id}', Customer::class . ':delete');//Listo
});

$app->group('/product', function(RouteCollectorProxy $product){
    $product->get('/{page}/{limit}', Product::class . ':filter' );//Listo
    $product->get('', Product::class . ':numRegs');//Listo
    $product->get('/data', Product::class . ':get');//Listo
    $product->get('/{id}', Product::class . ':find');//Listo 
    $product->post('', Product::class . ':create');//Listo
    //modifica toda la estructura
    $product->put('/{id}', Product::class . ':edit');//Listo
    $product->delete('/{id}', Product::class . ':delete');//Listo
});

$app->group('/supplier', function(RouteCollectorProxy $supplier){
    $supplier->get('/{page}/{limit}', Supplier::class . ':filter' );//Listo
    $supplier->get('', Supplier::class . ':numRegs');//Listo
    $supplier->get('/data', Supplier::class . ':get');//Listo
    $supplier->get('/{id}', Supplier::class . ':find');//Listo 
    $supplier->post('', Supplier::class . ':create');//Listo
    //modifica toda la estructura
    $supplier->put('/{id}', Supplier::class . ':edit');//Listo
    $supplier->delete('/{id}', Supplier::class . ':delete');//Listo
});

$app->group('/warehouse', function(RouteCollectorProxy $wareHouse){
    $wareHouse->get('/{page}/{limit}', Warehouse::class . ':filter' );//Listo
    $wareHouse->get('', Warehouse::class . ':numRegs');//Listo
    $wareHouse->get('/data', WareHouse::class . ':get');//Listo
    $wareHouse->get('/{id}', WareHouse::class . ':find');//Listo 
    $wareHouse->post('', WareHouse::class . ':create');//Listo
    //modifica toda la estructura
    $wareHouse->put('/{id}', WareHouse::class . ':edit');//Listo
    $wareHouse->delete('/{id}', WareHouse::class . ':delete');//Listo
});

$app->group('/person', function(RouteCollectorProxy $person){
    $person->get('/{page}/{limit}', Person::class . ':filter' );//Listo
    $person->get('', Person::class . ':numRegs');//Listo
    $person->get('/data', Person::class . ':get');//Listo
    $person->get('/{id}', Person::class . ':find');//Listo 
    $person->post('', Person::class . ':create');//Listo
    //modifica toda la estructura
    $person->put('/{id}', Person::class . ':edit');//Listo
    $person->delete('/{id}', Person::class . ':delete');//Listo
});

