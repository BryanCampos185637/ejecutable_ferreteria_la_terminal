window.onload = function () {
    window.location.hash = "no-back-button";
    window.location.hash = "Again-No-back-button";//esta linea es necesaria para chrome
    window.onhashchange = function () { window.location.hash = "no-back-button"; }
}
$(function () {
    GenerarMenu();
})
function GenerarMenu() {
    $.get("/Login/generarMenu", function (data) {
        document.getElementById('btnCerrarSesion').innerHTML = '<a class="btn btn-dark" title="Cerrar sesion" style="border-color:#808080;" href="#" onclick="cerrarSesion()"><i class="fas fa-power-off"></i> </a>';
        var html = '';
        if (data != null && data.length != 0) {
            $.each(data, function (key, item) {
                html += '<a class="list-group-item list-group-item-action bg-dark text-light" href="/' + item.controlador + '/' + item.accion + '"><i class="' + item.icono + '"></i> ' + item.mensaje + '</a>';
            })
            $("#menuDinamico").html(html);
        }
    })
}
function cerrarSesion() {
    Swal.fire({
        title: 'Estas por cerrar sesión',
        text: '¿Estas seguro que deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cerrar!'
    }).then((result) => {
        if (result.isConfirmed) {
            /*document.getElementById('btnActivarCerrarSesion').click();*/
            location.href ='/Login/cerrarSesion'
        }
    })
}

/*Le cambia el idioma a las tablas que tengan paginacion*/
var idiomaTabla = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo":"",/* "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",*/
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    },
    "buttons": {
        "copy": "Copiar",
        "colvis": "Visibilidad"
    }
}
