<?php
//conntroladores

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;
use PDO;

class User extends DBAccess {
    //atributos
    const RESOURCE = "User";

    private function authenticate($idPerson, $passw){
        //como se quiere caer en una variable en concreto se coloca nameVar : $varNew
        $data = $this -> findUsr(idPerson: $idPerson);
        return (($data) && (password_verify($passw, $data -> passw))) ? ['role' => $data -> role] : null;
    }
    public function changeRole(Request $request, Response $response, $args){
        $body = json_decode($request -> getbody());
        $data = $this ->editPerson(idPerson: $args['id'], role: $body->role);
        $status = $data == true ? 200:404;
        return $response -> withStatus($status);
    }//End changeRole
    
    public function changePassw(Request $request, Response $response, $args){
        $body = json_decode($request -> getbody(), 1);
        //authenticate
        $person = $this->authenticate($args['id'], $body['passw']);

        if($person){
            $data = $this ->editPerson(idPerson: $args['id'], passwN: Hash::hash($body['passwN']));
            $status = 200;
        }else{
            $status = 401;
        }
        return $response->withStatus($status);
    }
    
    public function resetPassw(Request $request, Response $response, $args){
        $body = json_decode($request -> getbody());
        $data = $this ->editPerson(idPerson: $args['id'], passwN: Hash :: hash($body->passwN));
        $status = $data == true ? 200:404;
        return $response -> withStatus($status);
    }//End resetPassw

}//End class
