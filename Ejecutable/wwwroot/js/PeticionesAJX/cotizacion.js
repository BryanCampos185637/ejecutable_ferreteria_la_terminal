window.onload = callTable();
function callTable() {
    paintTable('/Cotizacion/listDetalleCotizacion', ['producto', 'um', 'cant', 'P.U', 'comi', 'p.com', 'desc', 'p.des', 'subt']);
};
/**
 * Funcion para pintar las tablas
 * @param {any} link solicitamos la url del controlador que contenga la accion
 * @param {any} headboard//y los encabezados de la tabla
 */
function paintTable(link, headboard) {
    var totalComision = 0;
    var totalDescuento = 0;
    var totalPagar = 0;
    $.get(link, function (data) {
        if (data.length > 0) {
            document.getElementById('btnImprimir').removeAttribute('disabled');
            document.getElementById('btnCancelarCotizacion').removeAttribute('disabled');
        } else {
            document.getElementById('btnCancelarCotizacion').setAttribute('disabled', '');
            document.getElementById('btnImprimir').setAttribute('disabled', '');
            document.getElementById('totalComision').innerHTML = '$0.00';
            document.getElementById('totalDescuento').innerHTML = '$0.00';
            document.getElementById('totalVenta').innerHTML = '$0.00';
        }
        var html = "";
        html += '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="pagination">';
        html += '<thead class="thead-dark">'
        html += '<tr>'
        var i = 0;
        while (i < headboard.length) {
            html += '<th>' + headboard[i].toUpperCase() + '</th>'
            i++;
        }
        html += '<th>OPCIONES</th>'
        html += '</tr>'
        html += '</thead>'
        html += '<tbody>'
        $.each(data, function (obj, item) {
            var esSubProducto = item.essubproducto;
            html += '<tr>';
            html += '<td>' + item.nombreproducto + '</td>';
            if (!esSubProducto)
                html += '<td>' + item.unidadmedida + '</td>';
            else
                html += '<td>' + item.subproducto + '</td>';
            html += '<td>' + item.cantidad + '</td>';
            html += '<td>' + item.precioconcomision.toFixed(4) + '</td>';
            html += '<td>' + item.comision.toFixed(4) + '</td>';
            html += '<td>' + item.pcomision + '%</td>';
            html += '<td>' + item.descuento.toFixed(4) + '</td>';
            html += '<td>' + item.pdescuento + '%</td>';
            html += '<td>' + item.total.toFixed(4) + '</td>';
            html += '<td class="text-center">';
            html += '<a title="Eliminar producto de la lista" class="btn-sm btn-danger" href="#" onclick="deleteProducto(' + item.idlista + ')"><i class="fas fa-trash"></i></a> ';
            html += '</td>';
            html += '</tr>';
            totalComision = (totalComision + item.comision) * 1;
            totalPagar = (totalPagar + item.total) * 1;
            totalDescuento = (totalDescuento + item.descuento) * 1;
        })
        html += '</tbody>'
        html += '</table>'
        $("#tableData").html(html);
        $("#pagination").DataTable({
            pageLength: 4,
            lengthMenu: [4, 10, 15, 20],
            lengthChange: false,
            language: idiomaTabla
        });
        //agreamos al detalle de la venta los totales
        var comisionmenosdescuento = totalComision - totalDescuento;
        document.getElementById('totalComisionMenosDescuento').innerHTML = '$' + comisionmenosdescuento.toFixed(4);
        document.getElementById('totalComision').innerHTML = '$' + totalComision.toFixed(4);
        document.getElementById('totalDescuento').innerHTML = '$' + totalDescuento.toFixed(4);
        document.getElementById('totalVenta').innerHTML = '$' + totalPagar.toFixed(4);
    })
}

/*funcion que pinta la tabla en la modal de productos */
function abrirModalProducto(tipo) {
    var url = '/producto/filtrarProductos';
    var codigo = document.getElementById('filtrarPorCodigo');
    var descripcion = document.getElementById('filtrarPorDescripcion');
    switch (tipo) {
        case 1:
            descripcion.value = '';
            if (codigo.value.trim() != '')
                url = '/producto/filtrarProductos?Codigo=' + codigo.value;
            break;
        case 2:
            codigo.value = '';
            if (descripcion.value.trim() != '')
                url = '/producto/filtrarProductos?Nombre=' + descripcion.value;
            break;
        default:
            url = '/producto/filtrarProductos';
            break;
    }
    $.get(url, function (data) {
        var html = '';
        html += '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="tableproduct">';
        html += '<thead class="thead-dark">';
        html += '<tr>';
        html += '<th>COD</th>';
        html += '<th>PRODUCTO</th>';
        html += '<th>STOCK</th>';
        html += '<th>EXISTENCIAS</th>';
        html += '<th>PRECIO</th>';
        html += '<th>EQUIVALENCIA</th>';
        html += '<th>SUBEXIST</th>';
        html += '<th>SUBPRECIO</th>';
        html += '<th class="text-center">OPCIONES</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        $.each(data, function (objeto, propiedad) {
            var subexistencia = propiedad.subexistencia;
            var subprecio = propiedad.subprecioventa * 1;
            var equivalencia = propiedad.equivalencia;
            html += '<tr>';
            html += '<td>' + propiedad.codigoproducto + '</td>';
            html += '<td>' + propiedad.descripcion + '</td>';
            html += '<td>' + propiedad.nombrestock + '</td>';
            html += '<td>' + propiedad.existencias + '</td>';
            html += '<td>' + propiedad.precioventa + '</td>';
            if (propiedad.equivalencia != null && propiedad.equivalencia != '')
                html += '<td>' + equivalencia + '</td>';
            else
                html += '<td class="text-center"><i class="fas fa-exclamation"></i></td>';
            if (subexistencia > 0 && subexistencia != null)//si subexistencias es diferente de null
                html += '<td>' + subexistencia + '</td>';
            else//si es null
                html += '<td class="text-center"><i class="fas fa-exclamation"></i></td>';

            if (subprecio > 0 && subprecio != null)//si subprecio es diferente de null
                html += '<td>' + subprecio + '</td>';
            else//si es null
                html += '<td class="text-center"><i class="fas fa-exclamation"></i></td>';
            /*botonera de opciones*/
            html += '<td class="text-center">';
            html += '<a title="Selecciona el producto con el precio original" class="badge badge-primary" href="#" onclick="getProducto(' + propiedad.iidproducto + ')">' + propiedad.nombreunidad + '</a> ';
            if (propiedad.nombresubunidad != 'No tiene') {//si la sub existencia existe podemos vender original y sub producto
                html += '<a title="Selecciona el producto con el subprecio" class="badge badge-success" href="#" onclick="getSubProducto(' + propiedad.iidproducto + ')">' + propiedad.nombresubunidad + '</a> ';
            }
            html += '</td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';
        $('#tablaProducto').html(html);
        $("#tableproduct").DataTable({
            searching: false,
            pageLength: 5,
            lengthMenu: [5, 10, 15, 20],
            lengthChange: false,
            language: idiomaTabla
        });
    });
}
/*obtiene el producto original*/
function getProducto(id) {
    /**
    * llena el formulario donde se agrega el descuento cantidad y comision
    * @param {any} id//se solicita el id del producto
    */
    $.get('/producto/getProductoById?id=' + id, function (data) {
        $('#txtExistencias').val(1000000);
        $('#txtPrecioUnitario').val(data.precioventa);
        $('#iidproducto').val(data.iidproducto);
        $('#subunidad').val(0);
        $.get('/producto/ObtenerNombreUnidad?id=' + data.iidunidadmedida, function (nombreunidad) {
            $('#txtProducto').val('[' + nombreunidad + '] ' + data.descripcion);
        });
        calculateDiscount();//calculamos
    });
    document.getElementById('btnCerrarProducto').click();//cerramos el modal
}
/*obtiene el producto original*/
function getSubProducto(id) {
    $.get('/producto/getProductoById?id=' + id, function (data) {
        $.get('/producto/ObtenerNombreUnidad?id=' + data.subunidad, function (nombreunidad) {
            $('#txtProducto').val('[' + nombreunidad + '] ' + data.descripcion);
        });
        $('#txtExistencias').val(1000000);
        $('#txtPrecioUnitario').val(data.subprecioventa);
        $('#iidproducto').val(data.iidproducto);
        $('#subunidad').val(data.subunidad);
        calculateDiscount();//calculamos
    });
    document.getElementById('btnCerrarProducto').click();//cerramos el modal
}
//mensaje de error cuando el producto no tiene suficientes existencias
function mensajeError() {
    messeges('error', 'No hay suficiente producto para vender');
}
/**
 * llena el formulario donde se agrega el descuento cantidad y comision
 * @param {any} id//se solicita el id del producto
 */
/*calculo de la comision y descuento */
function calculateDiscount() {
    var txtDescuento = document.getElementById('txtDescuento').value * 1;
    var txtComision = document.getElementById('txtComision').value * 1;
    var precioUnitario = document.getElementById('txtPrecioUnitario').value * 1;
    var txtCantidad = document.getElementById('txtCantidad').value * 1;
    var tcomision = 0; var tdescuento = 0; var comision = 0; var descuento = 0;
    //calculos
    if (txtDescuento != "" || txtComision != "" || txtCantidad != "") {
        //obtener comision
        tcomision = ((parseFloat(precioUnitario) / 100) * txtComision);//se obtiene la comision unitaria
        comision = tcomision * txtCantidad;//se multiplica por la cantidad de producto que se llevara
        document.getElementById('txtTcomision').value = comision.toFixed(4);//se muestra el total
        //obtener descuento
        if (tcomision > 0) {//si se le a aplicado comision
            var precioUnitarioConComision = precioUnitario + tcomision;//se suma el precio unitario + el total de la comison
            tdescuento = ((precioUnitarioConComision / 100) * txtDescuento);//se le saca el descuento al resultado anterior
            descuento = tdescuento * txtCantidad;//se multiplica por la cantidad de producto que se llevara
            document.getElementById('txtTdescuento').value = descuento.toFixed(4);//se muestra el total
        } else {//si no tiene comision
            tdescuento = ((parseFloat(precioUnitario) / 100) * txtDescuento);//se le saca el descuento solo al precio unitario
            descuento = tdescuento * txtCantidad;//se multiplica por la cantidad de producto que se llevara
            document.getElementById('txtTdescuento').value = descuento.toFixed(4);//se muestra el total
        }
        //dar el total
        var totalPrecioUnitario = precioUnitario * txtCantidad;//se obtiene el total de la compra 
        var totalVenta = (totalPrecioUnitario + comision) - descuento;//se suman el total de la comision mas el precio unitario y a eso se le descuenta el total de descuento
        document.getElementById('txtTotal').value = totalVenta.toFixed(4);//se muestra el total
    }
}
/*funcion para agregar un producto a la lista de venta*/
function addProductToList() {
    if ($('#iidproducto').val() != "") {
        var cantidad = $('#txtCantidad').val() * 1;
        var comision = $('#txtComision').val();
        var descuento = $('#txtDescuento').val();
        var subUnidad = $('#subunidad').val();
        if (cantidad > 0) {
            var frm = new FormData();
            frm.append('subUnidad', subUnidad);
            frm.append('iiproducto', $('#iidproducto').val());
            frm.append('cantidad', $('#txtCantidad').val());
            if (comision != '')
                frm.append('comision', comision);
            else
                frm.append('comision', 0);
            if (descuento != '')
                frm.append('descuento', descuento);
            else
                frm.append('descuento', 0);
            $.ajax({
                url: '/cotizacion/ArmardetalleCotizacion',
                type: 'POST',
                contentType: false,
                processData: false,
                data: frm,
                success: function (r) {
                    if (r > 0) {
                        limpiar();
                        callTable();
                        messeges('success', 'Producto agregado');
                        $('#iidproducto').val('');
                    } else if (r == -1) {
                        messeges('warning', 'Este producto ya está en la lista.');
                    } else {
                        messeges('error', 'Error en el sistema')
                    }
                }
            })
        } else {
            messeges('warning', 'Cantidad no puede ser 0.');
        }//fin validacio cantidad > 0
    } else {
        messeges('error', 'No haz seleccionado un producto');
    }//fin validacio $('#iidproducto').val() != ""
}
/*limpia el formulario donde se agrega descuento y comision*/
function limpiar() {
    var inpust = document.getElementsByClassName('form-control');
    var descuento = document.getElementById('txtDescuento').value * 1;
    var comision = document.getElementById('txtComision').value * 1;
    for (var i = 0; i < inpust.length; i++) {
        var nombre = inpust[i].name;
        if (nombre == 'cantidad') {
            inpust[i].value = 1;
        } else if (nombre == 'descuento') {
            inpust[i].value = descuento;
            if (descuento > 0)
                inpust[i].style.borderColor = '#0000ff';
            else
                inpust[i].style.borderColor = '#ccc';
        } else if (nombre == 'comision') {
            inpust[i].value = comision;
            if (comision > 0)
                inpust[i].style.borderColor = '#0000ff';
            else
                inpust[i].style.borderColor = '#ccc';
        } else {
            inpust[i].value = '';
        }
    }
}
//guarda la cotizacion
function saveCotizacion() {
    var nombre = document.getElementById('nombre').value;
    var tipodoc = document.getElementById('tipodocumento').value;
    if (nombre != '' && tipodoc != '') {
        var obj = new FormData();
        obj.append('nombre', nombre);
        obj.append('tipodocumento', tipodoc);
        $.ajax({
            url: '/cotizacion/confirmarCotizacion',
            type: 'POST',
            contentType: false,
            processData: false,
            data: obj,
            success: function (data) {
                if (data > 0) {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Cotizacion creada',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.href = '/cotizacion/index';
                        } else {
                            location.href = '/cotizacion/index';
                        }
                    })
                } else if (data == -1) {
                    messeges('error', 'Se ha superado el límite de cotización establecido en el sistema');
                } else {
                    messeges('error', 'Error al crear la cotización ');
                }
            }
        })
    } else {
        messeges('error', 'Llena todos los campos')
        nombre.style.borderColor = "red";
        tipodoc.style.borderColor = "red";
    }
}
/**
 * funcion que quita un producto de la lista a cotizar
 * @param {any} id//se pide el id del producto
 */
function deleteProducto(id) {
    Swal.fire({
        title: 'Quitar de la lista',
        text: '¿Realmente desea quitar el producto de la lista?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/cotizacion/deleteProducto?id=' + id, function (r) {
                if (r > 0) {
                    callTable();
                    messeges('success', 'Producto eliminado')
                }
            })
        }
    })
};
/*
 * elimina toda la lizta de cotizacion
 */
function CancelCotizacion() {
    Swal.fire({
        title: 'Cancelar cotizacion',
        text: '¿Estas seguro que deseas cancelar la cotizacion?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/cotizacion/cancelarCotizacion', function (e) {
                if (e > 0) {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Cotizacion cancelada',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.href = '/cotizacion/index';
                        } else {
                            location.href = '/cotizacion/index';
                        }
                    })
                } else {
                    messeges('error', 'Error al intentar cancelar la cotizacion.')
                }
            })
        }
    })
}

function messeges(icons = 'success', titles = 'Exito') {
    Swal.fire({
        position: 'center',
        icon: icons,
        title: titles,
        showConfirmButton: false,
        timer: 1500
    })
}
function messegeConfirm(url, mensaje = 'Elminiar', subtitulo = '¿Estas seguro que deseas eliminar el registro?',
    tituloBoton = 'Eliminar') {
    Swal.fire({
        title: mensaje,
        text: subtitulo,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteData(url);
        }
    })
}