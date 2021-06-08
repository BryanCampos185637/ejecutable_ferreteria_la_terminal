window.onload = callTable()
$(document).ready(function ($) {
    $('#dui').inputmask('99999999-9', { placeholder: '00000000-0' });
    $('#telefono').inputmask('99999999', { placeholder: '00000000' });
})

function callTable() {
    paintTable('/empleado/listEmpleado', ['nombre', 'edad', 'teléfono', 'dui'],
        ['nombrecompleto', 'edad', 'telefono', 'dui'], 'iidempleado', 'modalEmpleado');
    fillCombo('/empleado/listTipoUsuario', 'iidtipousuario', 'nombretipousuario', 'iidtipousuario', 'descripcion');
};

$('#frmEmpleado').submit(function (e) {
    e.preventDefault();
    sendData();
});

function edit(id) {
    clearData();
    colorDefault();
    $.get('/empleado/geEmpleadotById?id=' + id, function (data) {
        $('#iidempleado').val(data.iidempleado);
        $('#nombrecompleto').val(data.nombrecompleto);
        $('#edad').val(data.edad);
        $('#telefono').val(data.telefono);
        $('#dui').val(data.dui);
        document.getElementById('nombreusuario').setAttribute('readonly', '');
        $.get('/empleado/obtenerUsuario?id=' + id, function (data) {
            $('#iidusuario').val(data.iidusuario);
            $('#nombreusuario').val(data.nombreusuario);
            $('#contraseña').val(data.contraseña);
            $('#contraseña1').val(data.contraseña);
            $('#iidtipousuario').val(data.iidtipousuario);
        })
    })
};

function deleteInfo(id) {
    messegeConfirm('/empleado/deleteEmpleado?id=' + id);
};

function sendData() {
    if (validateEmpty()) {
        if ($('#edad').val() > 0) {
            if (!isNaN($('#telefono').val())) {
                document.getElementById('telefono').style.borderColor = '#ccc';
                var dui = document.getElementById('dui').value;
                if (dui.length == 10) {
                    document.getElementById('dui').style.borderColor = '#ccc';
                    var contraseña1 = document.getElementById('contraseña1').value;
                    var contraseña = document.getElementById('contraseña').value;
                    if (contraseña1.length >= 5) {
                        document.getElementById('contraseña1').style.borderColor = '#ccc';
                        if (contraseña1.trim() == contraseña.trim()) {
                            var frm = new FormData();
                            capturarData(frm);
                            sendDataController('/empleado/saveEmpleado', frm, 'Este DUI ya existe en la base de datos');
                        } else {
                            document.getElementById('contraseña').style.borderColor = 'red';
                            messeges('error', 'Las contraseñas no coinciden ');
                        }
                    } else {
                        document.getElementById('contraseña1').style.borderColor = 'red';
                        messeges('error', 'Las contraseñas deben de tener por lo menos 5 caracteres ');
                    }
                } else {
                    document.getElementById('dui').style.borderColor = 'red';
                    messeges('error','Dui con formato incorrecto [00000000-0]');
                }//validar dui
            } else {
                document.getElementById('telefono').style.borderColor = 'red';
                messeges('error','El teléfono solo acepta números ')
            }//validacion telefono
        } else {
            messeges('error','La edad no puede estar en valor 0 o negativo ');
        }//validar edad
    } else {
        messeges('error','Llena los campos marcados');
    }//validacion espacios vacios
};

/*quita el readonly del nombre usuario*/
document.getElementById('btnOpenModal').onclick = function () {
    document.getElementById('nombreusuario').removeAttribute('readonly');
    clearData();
}