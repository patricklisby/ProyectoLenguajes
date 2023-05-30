<?php

    $cadEntrada = "PatrickLisby123";

    echo $cadEntrada."<br>";

    $opciones = [
        'cost' => 10,
        //'salta' => bind2Hex(random_bytes(16));
    ];

    $entradaConHash = password_hash($cadEntrada, PASSWORD_BCRYPT, $opciones);
    echo "Con Hash: ".$entradaConHash;

    $cadDigitado = "PatrickLisby123";

    if(password_verify($cadDigitado, $entradaConHash)){
        echo "<br>Acceso Permitido";
    }
    else{
        echo "<br>Acceso denegado";
    }
    
?>