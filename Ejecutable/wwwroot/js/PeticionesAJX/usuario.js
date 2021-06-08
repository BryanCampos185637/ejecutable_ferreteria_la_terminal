window.onload = callTable()
function callTable() {
    paintTable('/usuario/listUsuario', ['empleado', 'rol', 'usuario'],
        ['nombreempleado', 'nombretipousuario', 'nombreusuario'], 'iidusuario', 'modalUsuario');
};

function openModal(tipo = 'add') {
    colorDefault();
    if (tipo == 'edit') {
        document.getElementById('iidempleado').classList.add('requerid');
        document.getElementById('divEmpleado').style.display = 'none';
    } else {
        document.getElementById('nombreusuario').removeAttribute('readonly');
        document.getElementById('divEmpleado').style.display = 'block';
    }
    fillCombo('/usuario/listTipoUsuario', 'iidtipousuario', 'nombretipousuario', 'iidtipousuario', 'descripcion');
    fillCombo('/usuario/listEmpleado', 'iidempleado', 'nombrecompleto', 'iidempleado');
    clearData();
}

$('#frmUsuario').submit(function (e) {
    e.preventDefault();
    sendData();
});

function edit(id) {
    openModal('edit');
    document.getElementById('divEmpleado').style.display = 'none';
    document.getElementById('iidempleado').classList.remove('requerid');
    document.getElementById('nombreusuario').setAttribute('readonly', '');
    $.get('/usuario/getUsuarioById?id=' + id, function (data) {
        $('#iidusuario').val(data.iidusuario);
        $('#nombreusuario').val(data.nombreusuario);
        $('#contraseña').val(data.contraseña);
        $('#iidempleado').val(data.iidempleado);
        $('#iidtipousuario').val(data.iidtipousuario);
    })
};

function deleteInfo(id) {
    messegeConfirm('/usuario/deleteUsuario?id=' + id);
};

function sendData() {
    if (validateEmpty()) {
        var contrasena = document.getElementById('contraseña').value;
        if (contrasena.length >= 5) {
            var frm = new FormData();
            capturarData(frm);
            sendDataController('/usuario/saveUsuario', frm, 'Nombre usuario ya esta en uso.');
        } else {
            messeges('warning', 'La contraseña debe tener al menos 5 caracteres ');
        }
    } else {
        messeges('success', 'Complete los campos marcados');
    }
};