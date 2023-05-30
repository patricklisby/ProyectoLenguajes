<?php
    namespace App\controller;

    class Hash{
        //:dato    debe devolver un string
        public static function hash(string $texto):string{
            return password_hash($texto, PASSWORD_BCRYPT, ['cost' => 10]);
        }
    }//end class