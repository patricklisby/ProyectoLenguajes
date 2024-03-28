<?php
$container -> set('config_bd', function(){
    return(object)[
        "host"=> "localhost",
        "bd"=>"gestioninventarios",
        "usr"=>"root",
        "pass"=>"",
        "charset"=>"utf8mb4"
    ];
});
?>