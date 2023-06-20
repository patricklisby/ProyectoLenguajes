<?php

namespace App\controller;

use Psr\Container\ContainerInterface;
use PDO;


class DBAccess
{
    protected $container;
    //constructor en php
    public function __construct(ContainerInterface $c)
    {
        $this->container = $c;
    }
    private function generarParam($datos)
    {
        $cad = "(";
        foreach ($datos as $campo => $valor) {
            $cad .= ":$campo,";
        }
        $cad = trim($cad, ',');
        $cad .= ");";
        return $cad;
    } //End generarParam

    public function createBD($datos, $RESOURCE)
    {
        $params = $this->generarParam($datos);
        $sql = "SELECT new$RESOURCE$params;";
        $d = [];
        foreach ($datos as $clave => $valor)
            $d[$clave] = $valor;
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con = null;
        return $res;
    }

    public function createUsrBD($datos, $RESOURCE, $role, $campoId)
    {
        //Asigna el valor que trae datos de la contrase;a ne la variable $passw
        $passw = $datos->passw;

        //Elimina el valor de passw de $datos para no tener un dato extra que no se ocupa
        unset($datos->passw);
        $params = $this->generarParam($datos);
        $con = $this->container->get('bd');
        //Empieza a usar transacciones para mover datos
        $con->beginTransaction(); //Para que se ejecute todo o no se haga nada
        try {
            $sql = "SELECT new$RESOURCE$params;";
            $query = $con->prepare($sql);

            $d = [];
            foreach ($datos as $clave => $valor) {
                $d[$clave] = filter_var($valor, FILTER_SANITIZE_SPECIAL_CHARS);
            }
            $query->execute($d);
            $res = $query->fetch(PDO::FETCH_NUM)[0];
            //Crear usuario
            $sql = "SELECT newPerson(:usr, :role, :passw);";
            $query = $con->prepare($sql);
            $query->execute(array(
                'usr' => $d[$campoId],
                'role' => $role,
                'passw' => $passw
            ));
            $con->commit();
        } catch (PDOException $ex) {
            //rollback() => 
            print_r($ex->getMessage()); //Se quita en producción
            $con->rollback();
            $res = 2;
        }

        $query = null;
        $con = null;
        return $res;
    }

    public function editBD($datos, $RESOURCE, $id)
    {
        $params = $this->generarParam($datos);
        $params = substr($params, 0, 1) . ":id," . substr($params, 1);
        
        $sql = "SELECT edit$RESOURCE$params";
        $d['id'] = $id;
        //var_dump($d);die();
        foreach ($datos as $clave => $valor) {
            $d[$clave] = $valor;
        }
        $con = $this->container->get('bd');

        $query = $con->prepare($sql);

        $query->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con = null;
        
        return $res;
    }

    public function deleteBD($id, $RESOURCE)
    {
        $sql = "SELECT delete$RESOURCE(:id);";

        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute(["id" => $id]);
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con = null;
        return $res;
    } //End delete

    public function findBD($id, $RESOURCE)
    {
        $sql = "CALL find$RESOURCE(:id);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute(['id' => $id]);

        $res = $query->fetch(PDO::FETCH_ASSOC);
        $query = null;
        $con = null;
        return $res;
    } //End find

    public function getData($RESOURCE)
    {
        $con = $this->container->get('bd');
        $query = $con->prepare("call get$RESOURCE();");
        $query->execute();
        $res = $query->fetchAll();
        $query = null;
        $con = null;
        return $res;
    }

    public function filterBD($datos, $args, $recurso)
    {
        $limite = $args['limit'];
        $pagina = ($args['page'] - 1) * $limite;
        $cadena = "";
        foreach ($datos as $valor) {
            $cadena .= "%$valor%&";
        }
        $sql = "call filter$recurso('$cadena', $pagina, $limite);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $status = $query->rowCount() > 0 ? 200 : 204;

        //en res se encuentran los datos
        $res = $query->fetchAll();
        $query = null;
        $con = null;
        $datosRetorno['datos'] = $res;
        $datosRetorno['regs']  = $this->numRegsBD($datos, $recurso);
        
        return $datosRetorno;
    } //End filtrar


    public function numRegsBD($datos, $RESOURCE)
    {
        $cadena = "";
        foreach ($datos as $valor) {
            $cadena .= "%$valor%&";
        }
        $sql = "call numRegs$RESOURCE('$cadena');";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con = null;
        return $res;
    } //End numRegs

    public function cambiarPropietarioBD($d)
    {
        //(:id,:idCustomer)
        $params = $this->generarParam($d);

        $sql = "SELECT cambiarPropietario$params";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->bindParam(':id', $d['id'], PDO::PARAM_INT);
        $query->bindParam(':idCustomer', $d['idCustomer'], PDO::PARAM_INT);
        $query->execute();
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con = null;

        return $res;
    } //End cambiarPropietario

    //Parametros opcionales es varName = -1 (ya que al no existir no guarda nada)
    public function editPerson(string $idPerson, int $role = -1, string $passwN = '')
    {
        $proc = $role == -1 ? 'select passwPerson(:id,:passw);' : 'select rolPerson(:id,:role);';
        $sql = "call findPerson(0,$idPerson);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        $usuario = $query->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            $params = ['id' => $usuario['id']];
            $params = $role == -1 ? array_merge($params, ['passw' => $passwN]) :
                array_merge($params, ['role' => $role]);
            $query = $con->prepare($proc);
            $retorno = $query->execute($params);
        } else {
            $retorno = false;
        }
        $query = null;
        $con = null;

        return $retorno;
    } //End editPerson

    public function findUsr(int $id = 0, string $idPerson = '')
    {
        $con = $this->container->get('bd');
        $query = $con->prepare("CALL findPerson($id, $idPerson);");
        $query->execute();
        $res = $query->fetch();
        $query = null;
        $con = null;
        return $res;
    } //End findUsr

    public function findName($id, string $tipoPerson)
    {

        $proc = 'find' . $tipoPerson . "(0, '$id')";
        $sql = "call $proc";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute();
        if ($query->rowCount() > 0) {
            $res = $query->fetch(PDO::FETCH_ASSOC);
        } else {
            $res = [];
        }
        $query = null;
        $con = null;
        $res = $res['nombre'];
        if (str_contains($res, " ")) {
            $res = substr($res, 0, strpos($res, " "));
        }
        return $res;
    } //End findUsr

    public function accederToken(string $proc, string $idPerson, string $tokenRef = "")
    {
        $sql = $proc == "modificar" ? "select modificarToken(:idPerson, :tk);" :
            "call verificarToken(:idPerson, :tk);";
        $con = $this->container->get('bd');
        $query = $con->prepare($sql);
        $query->execute(["idPerson" => $idPerson, "tk" => $tokenRef]);
        if ($proc == "modificar") {
            $datos = $query->fetch(PDO::FETCH_NUM);
        } else {
            $datos = $query->fetchColumn();
        }
        $sql = null;
        $con = null;
        return $datos;
    } //end accederToken

}//End class