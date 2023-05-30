<?php
//conntroladores

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class Person extends DBAccess {
    //atributos
    const RESOURCE = "Person";

    public function create(Request $request, Response $response, $args){
      $body = json_decode($request -> getbody());

      //self para llamar constantes
      $res = $this -> createBD($body,self::RESOURCE)[0];
        $status = match($res){
            '0' => 201,
            '1' => 409,
            '2' => 404
        };
         return $response -> withStatus($status);
    }
    //Funciona
    public function edit(Request $request, Response $response, $args){
        $id = $args['id'];
        $body = json_decode($request -> getbody(),1);
        $res = $this ->editBD($body, self::RESOURCE, $id);
        $status = match($res[0]){
            '0' => 404,
            '1' => 200,
            '2' => 409
        };
           return $response -> withStatus($status);
    }
    //Funciona
    public function delete(Request $request, Response $response, $args){
        $res = $this -> deleteBD($args['id'],self::RESOURCE);
        $status = $res > 0?200:404;
        return $response -> withStatus($status);
    }//End delete
    
    //No funciona
    public function get(Request $request, Response $response, $args){
        $res = $this -> getData(self::RESOURCE);
        $status = sizeof($res) > 0 ? 200 : 204;
        if($res)
        $response->getBody()->write(json_encode($res));

      return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }
//Funciona
    public function find(Request $request, Response $response, $args){
        $id = $args['id'];
        $res = $this -> findBD($id, self::RESOURCE);
        $status = !$res ? 404:200;

        if($res )
        $response->getBody()->write(json_encode($res));

      return $response
            ->withHeader('Content-type', 'Application/json')
            ->withStatus($status);
    }//End find

}//End class
