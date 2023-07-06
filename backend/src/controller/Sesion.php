<?php
//conntroladores

namespace App\controller;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;

class Sesion extends DBAccess {

    const TIPO_USR =[
        1 => "Admin",
        2 => "Vendedor",
        3 => "Oficinista",
        4 => "Bodeguero(a)"
    ];

    private function modificarToken(string $idPerson, string $tokenRef =""){
       return $this -> accederToken('modificar', $idPerson, $tokenRef );
    }//End modificar
    private function verificarRefrescoToken(string $idPerson, string $tokenRef =""){
        return $this -> accederToken('verificar', $idPerson, $tokenRef );
     }//End modificar

    public function generarTokens(string $idPerson, int $rol, string $nombre){
        $key = 'Alguna clave';//Crear una clave
        //Token authenticate = solo sirve si esta autenticado
        //Token de refresco = se guarda en la BD, para saber si en el servidor esta autenticado dentro del servidor.
        $paylaod = [
            'iss' => $_SERVER['SERVER_NAME'],
            'iat' => time(),
            'exp' => time() + 30,
            'sub' => $idPerson,
            'rol' => $rol,
            'nom' => $nombre
        ];
        $paylaodRef = [
            'iss' => $_SERVER['SERVER_NAME'],
            'iat' => time(),
            'rol' => $rol
        ];
        
        
        $tkRef = JWT::encode($paylaodRef, $key, 'HS256');
        //Guardar el token.
        $this -> modificarToken(idPerson:$idPerson, tokenRef: $tkRef);
        return [
            "token" => JWT::encode($paylaod, $key, 'HS256'),
            "refreshToken" => $tkRef
        ];
    }//end generar

    private function authenticate($idPerson, $passw){
        //como se quiere caer en una variable en concreto se coloca nameVar : $varNew
        $datos = $this -> findUsr(idPerson: $idPerson);
        return (($datos) && (password_verify($passw, $datos -> passw))) ? ['idRol' => $datos -> idRol] : null;
    }

    public function login(Request $request, Response $response, $args){
        $body = json_decode($request ->  getBody());
        $res = $this->authenticate($args['id'], $body -> passw);
        //var_dump($res);die();
        //var_dump($args);die();
        if($res){
            $nombre = $this -> findName($args['id']);
           // var_dump($nombre);die();
            //generar token
            $tokens = $this->generarTokens($args['id'], $res['idRol'], $nombre);
           // var_dump($tokens);die();
            $response -> getBody()-> write(json_encode($tokens));
            $status = 200;
        }
        else{
            $status = 401;
        }
        return $response ->
         withHeader('Content-type', 'Application/json')
        ->withStatus($status);
    }//end login
    public function logout(Request $request, Response $response, $args){
        $this -> modificarToken(idPerson : $args['id']);
        return $response -> withStatus(200);
        }//end login

    public function reload(Request $request, Response $response, $args){
        $body = json_decode($request -> getBody());
        $rol = $this-> verificarRefrescoToken($args['id'], $body -> tkR);
       
        if($rol){
            $nombre = $this -> findName($args['id'], self::TIPO_USR[$rol]);
            $tokens = $this -> generarTokens($args['id'], $rol, $nombre);
        }if(isset($tokens)){
            $status = 200;
            $response -> getBody() -> write(json_encode($tokens));
        }
        else{
            $status = 401;
        }
        return $response 
        ->withHeader('Content-Type','Application/json')
        ->withStatus($status);
    }//end login

}//end class
?>