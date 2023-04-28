
window.addEventListener("load", function () {

    //*===== DEFINIMOS VARIABLES GLOBALES =====*//

    let idUser;
    let nombreUser;
    let idLocUsuario;

    //*========================================*//


    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        console.log(idUser);
        console.log(nombreUser);
        console.log(idLocUsuario);

        let datos = new FormData(formulario);

        if (idUser.trim() === '' && nombreUser.trim() === '' && idLocUsuario.trim() === '') {

            MostrarMensaje('error', 'Oops... Ha ocurrido un error', 'Completa los campos!!');
            return;
        }

        actualizarDatosUsuario();

    }

    );





    //*======================== OBTENER USUARIO ======================*//

    const dataUser = async () => {
        let formData = new FormData();


        formData.append("funcion", "obtenerUnSoloUsuario");

        try {

            const res = await fetch("http://localhost/PruebaHLS2/updateform.php", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            const inputUsuario = document.getElementById("idUser");
            inputUsuario.value = data.id + "- " + data.nombres;



            idUser = data.id;
            nombreUser = data.nombres;
            idLocUsuario = data.localidad;


            const selectElement = document.getElementById("idLocalidad");
            selectElement.addEventListener("change", (event) => {

                idLocUsuario = event.target.value;
                console.log(idLocUsuario); // muestra el nuevo valor de idLocUsuario después del cambio.
            });


            //================== MENSAJES ========================//

            const alerta = document.getElementById("alerta");
            if (data.success) {

                // Mensaje estatico SUCCESS por registro exitoso del usuario en la DB
                alerta.textContent = data.goodmessageUpdateUser;
                alerta.classList.remove("alert-danger");
                alerta.classList.add("alert-success");

                // Mensaje pop-up SUCCESS por registro exitoso del usuario en la DB
                Swal.fire({

                    icon: 'success',
                    title: data.goodmessageUpdateUser,
                    text: 'que disfrutes de la estadia.',
                })
            } else {

                // Mensaje de ERROR estatico por usuario ya registrado en la DB
                alerta.textContent = data.message;
                alerta.classList.remove("alert-success");
                alerta.classList.add("alert-info");

                Swal.fire({

                    // Mensaje pop-up ERROR por usuario ya registrado en la DB

                    icon: 'info',
                    title: data.message,
                    text: "Hola,  " + data.nombres + ".  Porfavor selecciona una localidad!",
                })

            }

            // Mostrar la alerta
            alerta.classList.remove("d-none");

            // Ocultar la alerta después de 7 segundos
            setTimeout(() => {
                alerta.classList.add("d-none");
            }, 7000);

        } catch (error) {
            console.log("HAY UN ERROR  " + error);
        }
    };



    //*===================== ACTUALIZACION DE LOCALIDAD ===================*//

    const actualizarDatosUsuario = async () => {



        if (idUser && nombreUser && idLocUsuario) {



            //ENVIAMOS LOS DATOS POR FETCH API //

            let formData = new FormData();
            formData.append("funcion", "actualizarUsuario");
            formData.append("idUser", idUser);
            formData.append("nombreUser", nombreUser);
            formData.append("idLocUsuario", idLocUsuario);




            try {

                // ESPERAMOS RESPUESTA DEL FETCH EN FORMATO JSON //

                const res = await fetch("http://localhost/PruebaHLS2/updateform.php", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json(); //cambiar a json.
                console.log(data);

                //===============================================//

                //=================== MENSAJES ================//

                const alerta = document.getElementById("alerta");
                if (data.success) {

                    // Mensaje estatico SUCCESS por registro exitoso del usuario en la DB
                    alerta.textContent = data.goodmessageUpdateUser;
                    alerta.classList.remove("alert-danger");
                    alerta.classList.add("alert-success");

                    // Mensaje pop-up SUCCESS por registro exitoso del usuario en la DB
                    Swal.fire({

                        icon: 'success',
                        title: data.goodmessageUpdateUser,
                        text: 'que disfrutes de la estadia   ' + nombreUser,
                    })
                } else {

                    // Mensaje de ERROR estatico por usuario ya registrado en la DB
                    alerta.textContent = data.message;
                    alerta.classList.remove("alert-success");
                    alerta.classList.add("alert-danger");

                    Swal.fire({

                        // Mensaje pop-up ERROR por usuario ya registrado en la DB

                        icon: 'error',
                        title: data.message,
                        text: nombreUser + "  revisa los datos ingresados.",
                    })

                }

            } catch (error) {

                console.error(error);
            }

        } else {

            console.log("CHE MAQUINA TENES UN ERROR!!");
        }


    }


    //*====================== OBTENER LOCALIDADES ===================*//

    const getLocalidades = async () => {
        let formData = new FormData();
        formData.append("funcion", "obtenerTodasLocalidades");



        try {

            const res = await fetch("http://localhost/PruebaHLS2/updateform.php", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            const localidad = document.getElementById("idLocalidad");
            for (let locali of data) {
                console.log(locali.id, locali.nombre);

                const option = document.createElement("option");
                option.value = locali.id;
                option.text = locali.nombre;
                localidad.add(option);
            }

        } catch (error) {
            console.log(error);
        }
    }

    /* 
    MENSAJES DE ALERTA.

    colocar mensajes de alerta al finalizar correctamente la app

    */


    function MostrarMensaje(icono, titulo, texto) {
        const alerta = document.getElementById("alertaInfo");

        Swal.fire({
            // Mensaje pop-up de error por inputs vacios (mensaje manual)
            icon: icono,
            title: titulo,
            text: texto,

        });

        // 1 Mostrar el alert bootstrap con las clases y mensajes correspondientes

        if (icono == "error") {



            alerta.textContent = texto;
            alerta.classList.remove("alert-success");
            alerta.classList.remove("alert-info");
            alerta.classList.add("alert-danger");

            document.getElementById('idParrafo').innerHTML = texto;
        } else {

            alerta.textContent = texto;
            alerta.classList.remove("alert-danger");
            alerta.classList.remove("alert-info");
            alerta.classList.add("alert-success");
        }

        //Mostrar la alerta en pantalla
        alerta.classList.remove("d-none");

        //Ocultar la alerta después de 7 segundos
        setTimeout(() => {
            alerta.classList.add("d-none");
        }, 7000);


    }



    //#region Llamadas a métodos
    dataUser();
    // actualizarDatosUsuario();
    getLocalidades();

    //#endregion

})