$(document).ready(function ($) {
    $('#dui').inputmask('99999999-9', { placeholder: '00000000-0' });
    $('#telefono').inputmask('99999999', { placeholder: '00000000' });
})
function Guardar() {
    if (validateEmpty()) {
        var dui = document.getElementById('dui').value.trim();
        var telefono = document.getElementById('telefono').value.trim();
        var edad = document.getElementById('edad').value * 1;
        var contrasena = document.getElementById('contraseña').value;
        if (dui.length == 10) {
            if (telefono.length == 8) {
                if (edad > 0) {
                    if (contrasena.length >= 5) {
                        var frm = new FormData();
                        capturarData(frm);
                        $.ajax({
                            url: '/login/registrar',
                            type: "POST",
                            processData: false,
                            contentType: false,
                            data: frm,
                            success: function (respuesta) {
                                if (respuesta > 0) {
                                    Swal.fire({
                                        title: 'Exito!',
                                        text: 'Usuario registrado',
                                        icon: 'success',
                                        showCancelButton: false,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            location.href = '/Login/index';
                                        } else {
                                            location.href = '/Login/index';
                                        }
                                    })
                                } else {
                                    messeges("error", "Error de sistema intente más tarde ");
                                }
                            }
                        })
                    } else {
                        messeges('warning','La contraseña debe tener al menos 5 caracteres ');
                    }
                } else {
                    messeges('warning','La edad no puede ser 0 o números negativos ');
                }
            } else {
                messeges('warning','El teléfono debe tener 8 dígitos');
            }
        } else {
            messeges('warning','El dui no cumple con el formato ');
        }
    } else {
        messeges('warning','Complete los campos marcados');
    }
}
function validateEmpty() {
    var rpt = true;
    var inputs = document.getElementsByClassName("requerid");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() == "") {
            rpt = false;
            inputs[i].style.borderColor = "red";
        } else {
            inputs[i].style.borderColor = "#ccc";
        }
    }
    return rpt;
}
function capturarData(frm) {
    var dataVista = document.getElementsByClassName("data");//recoje todos los que tengan la clase data
    for (var i = 0; i < dataVista.length; i++) {//itera todos los inputs
        if (dataVista[i].name != 'contraseña') {
            frm.append(dataVista[i].name, dataVista[i].value.trim().toUpperCase());// y forma el arreglo
        } else {
            frm.append(dataVista[i].name, dataVista[i].value.trim());// y forma el arreglo
        }
    }
    frm.append("bhabilitado", 'A');
}