<?php
session_start();

$funcion = $_POST["funcion"];



//CONEXION A LA BASE DE DATOS.


$host = "localhost";
$port = "5435";
$dbname = "db_prueba";
$user = "postgres";
$password = "113355";

$conex = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conex) {

    die("error de conexion: " . pg_last_error());
}



switch ($funcion) {


    case "obtenerTodasLocalidades":

        //===================== OBTENER LOCALIDADES ================//

        $opciones = array();
        $query = "SELECT * FROM localidades";
        $resultado = pg_query($conex, $query);

        if (pg_num_rows($resultado) > 0) {

            $localidades = pg_fetch_all($resultado);
            foreach ($localidades as $localidad) {
                $opciones[] = array("id" => $localidad["id"], "nombre" => $localidad["nombre"]);
            }
            echo json_encode($opciones);
        } else {

            $opciones = array(array("id" => "", "nombre" => "No se encontraron opciones disponibles"));
        }

        break;

        //==================== FIN OBTENER LOCALIDADES ==============//






    case "obtenerUnSoloUsuario":

        //===================== OBTENER REGISTRO USUARIO ==============//

        $idUsuario = array();
        $query = "SELECT * FROM usuarios LIMIT 1";
        $resultadox = pg_query($conex, $query);


        // Verificar si la consulta se ejecutó correctamente
        if ($resultadox) {
            // Obtener los datos de cada fila de resultadox
            while ($fila = pg_fetch_assoc($resultadox)) {



                // Agregar TODOS los datos de la fila al array $idUsuario
                $idUsuario[] = $fila;


            }
        } else {
            // Mostrar un mensaje de error si la consulta no se ejecutó correctamente
            echo "Error en la consulta: " . pg_last_error($conex);
        }

        // Desglosar los datos del array $idUsuario y enviar datos en formato json.
        foreach ($idUsuario as $usuario) {

            echo json_encode($usuario);
        }
        break;

        //=================== FIN OBTENER REGISTRO USUARIO ===================//


 


    case "actualizarUsuario":


        //===================== ACTUALIZACION DE LOCALIDAD ===================//


        $idUser = $_POST["idUser"];
        $nombreUser = $_POST["nombreUser"];
        $idLocUsuario = $_POST["idLocUsuario"];


        // Validar que las variables no esten vacias

        if (!isset($idUser) || !isset($nombreUser) || !isset($idLocUsuario)) {
            echo json_encode("Error: UNO O MAS VALORES SON UNDEFINED");
            break;
        }
        

        $querySelect = "SELECT id, localidad FROM usuarios WHERE id = '$idUser' AND localidad = '$idLocUsuario'";
        $resultadoSelect = pg_query($conex, $querySelect);

        if(pg_num_rows($resultadoSelect)){

            $resultado1 = array ("success" => false, "message" => "El usuario ya esta registrado en la localidad");
            echo json_encode($resultado1);

        }else {
            $query = "UPDATE usuarios SET localidad = '$idLocUsuario' WHERE id = $idUser";
            $resultadoUpdate = pg_query($conex, $query);
    
            //*==================== MENSAJES ==================*//
    
            if ($resultadoUpdate) {
                // Mensaje de actualización fue exitosa.
                $resultado1 = array("success" => true, "goodmessageUpdateUser" => "Actualización exitosa.");
                echo json_encode($resultado1);
            } else {
                // Mensaje de error en la conexión.
                $resultado1 = array("success" => false, "message" => "Hubo algún error en la actualización.");
                echo json_encode($resultado1);
                return;
            }

        }



        break;
        //=================== FIN ACTUALIZACION DE LOCALIDAD =================// 




    default:

        // código a ejecutar si no se cumple ninguno de los casos anteriores
        $resultado = array("success" => false, "messageErr" => "Acción no válida.");
        echo json_encode($resultado);
        break;
}
