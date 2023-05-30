<?php
namespace App\controller;

use Slim\Routing\RouteCollectorProxy;

$app->group('/person', function(RouteCollectorProxy $person){
    $person->patch('/role/{id}', Person::class . ':changeRole');

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
$app->group('/role', function(RouteCollectorProxy $role){
    $role->get('', Rol::class . ':get');//Listo
    $role->get('/{id}', Rol::class . ':find');//Listo 
    $role->post('', Rol::class . ':create');//Listo
    //modifica toda la estructura
    $role->put('/{id}', Rol::class . ':edit');//ListogetDataget
    $role->delete('/{id}', Rol::class . ':delete');//Listo
});

$app->group('/bills', function(RouteCollectorProxy $bills){
    $bills->get('', Bills::class . ':get');//Listo
    $bills->get('/{id}', Bills::class . ':find');//Listo 
    $bills->post('', Bills::class . ':create');//Listo
    //modifica toda la estructura
    $bills->put('/{id}', Bills::class . ':edit');//Listo
    $bills->delete('/{id}', Bills::class . ':delete');//Listo
});

$app->group('/classification', function(RouteCollectorProxy $classification){
    $classification->get('', Classification::class . ':get');//Listo
    $classification->get('/{id}', Classification::class . ':find');//Listo 
    $classification->post('', Classification::class . ':create');//Listo
    //modifica toda la estructura
    $classification->put('/{id}', Classification::class . ':edit');//Listo
    $classification->delete('/{id}', Classification::class . ':delete');//Listo
});

$app->group('/detail', function(RouteCollectorProxy $detail){
    $detail->get('', Detail::class . ':get');//Listo
    $detail->get('/{id}', Detail::class . ':find');//Listo 
    $detail->post('', Detail::class . ':create');//Listo
    //modifica toda la estructura
    $detail->put('/{id}', Detail::class . ':edit');//Listo
    $detail->delete('/{id}', Detail::class . ':delete');//Listo
});

$app->group('/customer', function(RouteCollectorProxy $customer){
    $customer->get('', Customer::class . ':get');//Listo
    $customer->get('/{id}', Customer::class . ':find');//Listo 
    $customer->post('', Customer::class . ':create');//Listo
    //modifica toda la estructura
    $customer->put('/{id}', Customer::class . ':edit');//Listo
    $customer->delete('/{id}', Customer::class . ':delete');//Listo
});

$app->group('/product', function(RouteCollectorProxy $product){
    $product->get('', Product::class . ':get');//Listo
    $product->get('/{id}', Product::class . ':find');//Listo 
    $product->post('', Product::class . ':create');//Listo
    //modifica toda la estructura
    $product->put('/{id}', Product::class . ':edit');//Listo
    $product->delete('/{id}', Product::class . ':delete');//Listo
});

$app->group('/supplier', function(RouteCollectorProxy $supplier){
    $supplier->get('', Supplier::class . ':get');//Listo
    $supplier->get('/{id}', Supplier::class . ':find');//Listo 
    $supplier->post('', Supplier::class . ':create');//Listo
    //modifica toda la estructura
    $supplier->put('/{id}', Supplier::class . ':edit');//Listo
    $supplier->delete('/{id}', Supplier::class . ':delete');//Listo
});

$app->group('/warehouse', function(RouteCollectorProxy $wareHouse){
    $wareHouse->get('', WareHouse::class . ':get');//Listo
    $wareHouse->get('/{id}', WareHouse::class . ':find');//Listo 
    $wareHouse->post('', WareHouse::class . ':create');//Listo
    //modifica toda la estructura
    $wareHouse->put('/{id}', WareHouse::class . ':edit');//Listo
    $wareHouse->delete('/{id}', WareHouse::class . ':delete');//Listo
});

$app->group('/person', function(RouteCollectorProxy $person){
    $person->get('', Person::class . ':get');//Listo
    $person->get('/{id}', Person::class . ':find');//Listo 
    $person->post('', Person::class . ':create');//Listo
    //modifica toda la estructura
    $person->put('/{id}', Person::class . ':edit');//Listo
    $person->delete('/{id}', Person::class . ':delete');//Listo
});

