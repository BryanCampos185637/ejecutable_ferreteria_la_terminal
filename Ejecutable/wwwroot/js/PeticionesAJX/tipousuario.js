
window.onload = callTable()
function callTable() {
    paintTable('/tipoUsuario/listTipoUsuario', ['nombre', 'descripción'],
        ['nombretipousuario', 'descripcion'], 'iidtipousuario', 'modalTipoUsuario');
};

$('#frmTipoUsuario').submit(function (e) {
    e.preventDefault();
    sendData();
});

function edit(id) {
    openModal();
    colorDefault();
    $.get('/TIPOUSUARIO/getTipoUsuarioById?id=' + id, function (data) {
        $('#iidtipousuario').val(data.iidtipousuario);
        $('#nombretipousuario').val(data.nombretipousuario);
        $('#descripcion').val(data.descripcion);
        marcarPaginasSeleccionadas(data.iidtipousuario);//marcamos las paginas que tenga asignadas
    });
};

function deleteInfo(id) {
    Swal.fire({
        title: 'Eliminar',
        text: '¿Seguro deseas eliminar este registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/tipousuario/deleteTipoUsuario?id=' + id, function (r) {
                switch (r) {
                    case 1:
                        messeges('success','Registro eliminado');
                        callTable();
                        break;
                    case 0:
                        messeges('error','Error al eliminar');
                        break;
                    case -1:
                        messeges('warning','Administrador no puede eliminarse');
                        break;
                }
            })
        }
    })
};

function sendData() {
    if (validateEmpty()) {
        var frm = new FormData();
        capturarData(frm);
        //capturamos los check manualmente
        var checkes = document.getElementsByClassName("paginasCheck");//obtenemos todos los check que contenga la clase paginasCheck
        for (var i = 0; i < checkes.length; i++) {//los vamos a recorrer usando for
            if (checkes[i].checked == true) {// si el input esta marcado
                var idpagina = checkes[i].value;//almacenamos el valor del heck
                frm.append("idPaginas[]", idpagina.replace("check", ""));//reemplazamos check y solo enviamos el id
            }
        }
        sendDataController('/tipousuario/saveTipoUsuario', frm, 'Este rol ya existe en la base de datos.');
    } else {
        messeges('warning','Complete los campos marcados');
    }
};

function openModal(valor = 0) {
    if (valor == 1) {
        clearData();
        listarPaginas();
    } else {
        listarPaginas();
    }

}
function listarPaginas() {
    $.get("/tipousuario/listPaginas", function (data) {
        var html = '';
        html += '<table class="">';
        for (var i = 0; i < data.length; i++) {
            html += '<tr>';
            html += '<td><label>' + data[i].mensaje + ': </label></td>';
            html += '<td>';
            html += '<input type="checkbox" class="paginasCheck" id="chk' + data[i].iidpagina + '" value="check' + data[i].iidpagina + '"/>';
            html += '</td>';
            html += '</tr>';
        }
        html += '</table>';
        $("#listadoPaginas").html(html);//pintamos el contenido
    });
}
function marcarPaginasSeleccionadas(idUsuario) {
    $.get("/tipousuario/listPaginasAsignadas?id=" + idUsuario, function (data) {
        for (var i = 0; i < data.length; i++) {
            var idgenerado = 'chk' + data[i].iidpagina;
            document.getElementById(idgenerado).checked = true;//si encuentra un id igual lo marcamos
        }
    });
}