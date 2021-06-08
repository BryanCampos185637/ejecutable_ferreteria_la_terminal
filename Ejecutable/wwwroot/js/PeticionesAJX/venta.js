window.onload = callTable();
$(document).ready(function ($) {
    $('#nit').inputmask('9999-999999-999-9', { placeholder: '0000-000000-000-0' });
    $('#registro').inputmask('999999-9', { placeholder: '000000-0' });
})
function callTable() {
    paintTable('/venta/listDetalleVenta', ['producto', 'um', 'cant', 'P.U', 'comi', 'p.com', 'desc', 'p.des', 'subt']);
    //esta funcion llama los producto que se venderan
};
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
            var existencia = propiedad.existencias * 1;
            var subexistencia = propiedad.subexistencia * 1;
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
            if (existencia > 0) {//si es mayor a 0 se puede vender
                if (existencia > 1) {//SI LA EXISTENCIA ES MAYOR A 1 NO HAY NINGUNA VALIDACION
                    html += '<a title="Selecciona el producto con el precio original" class="badge badge-primary" href="#" onclick="getProducto(' + propiedad.iidproducto + ')">' + propiedad.nombreunidad + '</a> ';
                    if (subexistencia > 0 && subexistencia != null) {//si la sub existencia existe podemos vender original y sub producto
                        html += '<a title="Selecciona el producto con el subprecio" class="badge badge-success" href="#" onclick="getSubProducto(' + propiedad.iidproducto + ')">' + propiedad.nombresubunidad + '</a> ';
                    }
                }
                else if (existencia == 1) {//SI PRODUCTO SOLO TIENE 1 Y TIENE SUB PRODUCTO SE DEBE VALIDAR
                    if (subexistencia <= 0 || subexistencia == null) {//SI NO TIENE SUB PRODUCTO SOLO SE AGREGA EL BOTON AZUL
                        html += '<a title="Selecciona el producto con el precio original" class="badge badge-primary" href="#" onclick="getProducto(' + propiedad.iidproducto + ')">' + propiedad.nombreunidad + '</a> ';
                    }
                    else {//SI TIENE SUB PRODUCTO SE DEBE VALIDAR EL BOTON AZUL 
                        if (subexistencia >= equivalencia) {//SI LA EQUIVALENCIA ES MAYOR O IGUAL A LAS SUB EXISTENCIAS PUEDE VENDERSE EL ORIGINAL Y LAS SUB PIEZAS
                            html += '<a title="Selecciona el producto con el precio original" class="badge badge-primary" href="#" onclick="getProducto(' + propiedad.iidproducto + ')">' + propiedad.nombreunidad + '</a> ';
                            html += '<a title="Selecciona el producto con el subprecio" class="badge badge-success" href="#" onclick="getSubProducto(' + propiedad.iidproducto + ')">' + propiedad.nombresubunidad + '</a> ';
                        }
                        else {//SI ES MENOR QUE LA EQUIVALENCIA SOLO EL SUB PRODUCTO
                            html += '<a title="Selecciona el producto con el subprecio" class="badge badge-success" href="#" onclick="getSubProducto(' + propiedad.iidproducto + ')">' + propiedad.nombresubunidad + '</a> ';
                        }
                    }
                }
            }
            else {//si es menor a 0
                html += '<a title="Este producto no cuenta con existencias" class="btn-sm btn-danger" href="#" onclick="mensajeError()">No hay <i class="fas fa-exclamation-triangle"></i></a> ';
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
        $('#txtExistencias').val(data.existencias);
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
        $('#txtExistencias').val(data.subexistencia);
        $('#txtPrecioUnitario').val(data.subprecioventa);
        $('#iidproducto').val(data.iidproducto);
        $('#subunidad').val(data.subunidad);
        calculateDiscount();//calculamos
    });
    document.getElementById('btnCerrarProducto').click();//cerramos el modal
}
/*funcion para calcular descuento y comision segun los porcentajes*/
function calculateDiscount() {
    var txtDescuento = document.getElementById('txtDescuento').value * 1;
    var txtComision = document.getElementById('txtComision').value * 1;
    var precioUnitario = document.getElementById('txtPrecioUnitario').value * 1;
    var txtCantidad = document.getElementById('txtCantidad').value * 1;
    var tcomision = 0; var tdescuento = 0; var comision = 0; var descuento = 0;
    //calculos
    if (txtDescuento != "" || txtComision != "" || txtCantidad!="") {
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
//pinta la lista de productos a vender
function paintTable(link, headboard) {
/**
* Funcion para pintar las tablas
* @param {any} link solicitamos la url del controlador que contenga la accion
* @param {any} headboard//y los encabezados de la tabla
*/
    var totalComision = 0; var totalDescuento = 0;var totalPagar = 0;
    $.get(link, function (data) {
        ProductosListados = data.length + 1;
        if (data.length>0) {//si la data es mayor a 0 se desbloquean los botones
            document.getElementById('btnFacturar').removeAttribute('disabled');
            document.getElementById('btnCancelarVenta').removeAttribute('disabled');
        } else {//si no se bloquean
            document.getElementById('btnCancelarVenta').setAttribute('disabled', '');
            document.getElementById('btnFacturar').setAttribute('disabled', '');
            document.getElementById('totalComision').innerHTML = '$0.0000';
            document.getElementById('totalDescuento').innerHTML = '$0.0000';
            document.getElementById('totalVenta').innerHTML = '$0.0000';
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
            totalComision = (totalComision + item.comision)*1;
            totalPagar = (totalPagar + item.total)*1;
            totalDescuento = (totalDescuento + item.descuento)*1 ;
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
        //agreamos al detalle de la venta los totales
        var comisionmenosdescuento = totalComision - totalDescuento;
        document.getElementById('totalComisionMenosDescuento').innerHTML = '$' + comisionmenosdescuento.toFixed(4);
        document.getElementById('totalComision').innerHTML = '$' + totalComision.toFixed(4);
        document.getElementById('totalDescuento').innerHTML = '$' + totalDescuento.toFixed(4);
        document.getElementById('totalVenta').innerHTML = '$' + totalPagar.toFixed(4);
    })
}
//elimina el producto de la lista
function deleteProducto(id) {
/**
* funcion que quita un producto de la lista a vender
* @param {any} id//se pide el id del producto
*/
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
            $.get('/venta/deleteProducto?id=' + id, function (r) {
                if (r > 0) {
                    callTable();
                    messeges('success','Producto eliminado')
                }
            })
        }
    })
}
/*mensaje de error*/
function mensajeError() {
    messeges('error','No hay suficiente producto para vender');
}
/*elimina toda la lista de productos */
function CancelSale() {
    Swal.fire({
        title: 'Cancelar venta',
        text: '¿Estas seguro que deseas cancelar la venta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cancelar!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('/venta/cancelarVenta', function (e) {
                if (e > 0) {
                    Swal.fire({
                        title: 'Exito',
                        text: 'Venta cancelada',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.href = '/venta/index';
                        } else {
                            location.href = '/venta/index';
                        }
                    })
                } else {
                    messeges('error', 'Error al cancelar la venta');
                }
            })
        }
    })
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
//llama a la funcion pintar numero factura
document.getElementById('btnFacturar').onclick = function () {
    clearData();
}
/*funcion que nos permite crear la factura y el pedido */
function saveFactura() {
    if ($('#tipocomprador').val() != '') {
        document.getElementById('tipocomprador').style.borderColor = '#ccc';
        if (validateEmpty()) {
            var frm = new FormData();
            frm.append('Tipocomprador', $('#tipocomprador').val().toUpperCase());
            frm.append('Nombrecliente', $('#nombrecliente').val().toUpperCase());
            frm.append('Direccion', $('#direccion').val().toUpperCase());
            frm.append('Registro', $('#registro').val().toUpperCase());
            frm.append('Giro', $('#giro').val().toUpperCase());
            frm.append('Nit', $('#nit').val());
            frm.append('iidcliente', $('#iidcliente').val());
            frm.append('Bhabilitado', 'A');
            $.ajax({
                url: '/venta/confirmVenta',
                type: 'POST',
                contentType: false,
                processData: false,
                data: frm,
                success: function (e) {
                    if (e == 'ok') {
                        Swal.fire({
                            title: 'Exito',
                            text: 'Venta creada',
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.href = '/venta/index';
                            } else {
                                location.href = '/venta/index';
                            }
                        })
                    } else if (e == 'finalFactura') {
                        messeges('error', 'Se ha superado el limite de facturas establecido en el sistema');
                    } else if (e == 'finalCredito') {
                        messeges('error', 'Se ha superado el limite de comprobantes de credito fiscal establecido en el sistema');
                    } else {
                        messeges('error', e);
                    }
                }
            });
        } else {
            messeges('warning','Complete los campos marcados');
        }//validacion de campos vacios
    } else {
        messeges('warning','Selecciona un tipo de comprador');
        document.getElementById('tipocomprador').style.borderColor = 'red';
    }//validacion de tipo comprador
}
/*validar que los campos no esten vacios*/
function validateEmpty() {
    var rpt = true;
    var input = document.getElementsByClassName('r');
    for (var i = 0; i < input.length; i++) {
        if (input[i].value.trim()== '') {
            input[i].style.borderColor = 'red'; rpt = false;
        } else {
            input[i].style.borderColor = '#ccc';
        }
    }
    return rpt;
}
/*verificamos el tipo de comprador*/
document.getElementById('tipocomprador').onchange = function () {
    var tipo = document.getElementById('tipocomprador').value;
    var inputP = document.getElementsByClassName('n');
    for (var i = 0; i < inputP.length; i++) {
        if (tipo == 'CREDITO FISCAL') {
            inputP[i].classList.add('r');
            document.getElementById('buscadorCliente').style.display = 'block';
        } else {
            inputP[i].classList.remove('r');
            inputP[i].style.borderColor = '#ccc';
            document.getElementById('buscadorCliente').style.display = 'none';
            clearData();
            document.getElementById('tipocomprador').value = 'CLIENTE FINAL';
        }
    }
}
//limpia los inputs
function clearData() {
    var dataVista = document.getElementsByClassName("form-control");//recoje todos los que tengan la clase data
    for (var i = 0; i < dataVista.length; i++) {//itera todos los inputs
        if (dataVista[i].name != 'total') {
            dataVista[i].value = "";
            dataVista[i].style.borderColor = "#ccc";
        }
    }
}
//funcion que ejecuta el guardado de la factura
document.getElementById('btnImprimir').onclick = function () {
    saveFactura();
}
//muestra los clientes fiscal
function abrirModalCliente() {
    $.get('/cliente/listCliente', function (data) {
        var html = '';
        html += '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="tablecliente">';
        html += '<thead class="thead-dark">';
        html += '<tr>';
        html += '<th>NOMBRE</th>';
        html += '<th>REGISTRO</th>';
        html += '<th>NIT</th>';
        html += '<th>OPERACIONES</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        $.each(data, function (objeto, propiedad) {
            html += '<tr>';
            html += '<td>' + propiedad.nombrecompleto + '</td>';
            html += '<td>' + propiedad.registro + '</td>';
            html += '<td>' + propiedad.nit + '</td>';
            html += '<td>';
            html += '<a class="btn-sm btn-primary" href="#" onclick="getCliente(' + propiedad.iidcliente + ')">seleccionar <i class="fas fa-check"></i></a> ';
            html += '</td>';
            html += '</tr>';
        });
        html += '</tbody>';
        html += '</table>';
        $('#tablaClienteFiscal').html(html);
        $("#tablecliente").DataTable({
            pageLength: 5,
            lengthMenu: [5, 10, 15, 20],
            lengthChange: false,
            language: idiomaTabla
        });
    });
}
//pinta la data del cliente seleccionado
function getCliente(id) {
    $.get('/cliente/getClienteById?id=' + id, function (data) {
        $('#iidcliente').val(data.iidcliente);
        $('#nombrecliente').val(data.nombrecompleto);
        $('#direccion').val(data.direccion);
        $('#registro').val(data.registro);
        $('#giro').val(data.giro);
        $('#nit').val(data.nit);
    });
    document.getElementById('btnCerrarModalCliente').click();//cerramos el modal
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
//abrir la modal de productos para hacer el descuento general
function descuentoGeneralAntesDeFacturar() {
    mostrarPosiblesProductosParDescuentoGeneral('/venta/listDetalleVenta',
            ['producto', 'cant', 'P.U', 'comi', 'p.com', 'desc', 'p.des', 'subt']);
}

function mostrarPosiblesProductosParDescuentoGeneral(link, headboard) {
    $.get(link, function (data) {
        var html = ""; var totalComision = 0; var totalFactura = 0; var totalDescuento = 0;
        var totalComisionProductosListados = 0; var totalFacturaProductosListados = 0; var totalProductosNoListados = 0;
        html += '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="ListaProductosDescuento">';
        html += '<thead class="thead-dark">'
        html += '<tr>'
        var i = 0;
        while (i < headboard.length) {
            html += '<th>' + headboard[i].toUpperCase() + '</th>'
            i++;
        }
        html += '</tr>'
        html += '</thead>'
        html += '<tbody>'
        $.each(data, function (obj, item) {
            var esSubProducto = item.essubproducto;
            if (!esSubProducto) {//solo se muestra si es un subproducto
                html += '<tr>';
                html += '<td>' + item.nombreproducto + '</td>';
                html += '<td>' + item.cantidad + '</td>';
                html += '<td>' + item.precioconcomision.toFixed(4) + '</td>';
                html += '<td>' + item.comision.toFixed(4) + '</td>';
                html += '<td>' + item.pcomision + '%</td>';
                html += '<td>' + item.descuento.toFixed(4) + '</td>';
                html += '<td>' + item.pdescuento + '%</td>';
                html += '<td>' + item.total.toFixed(4) + '</td>';
                html += '</tr>';
                totalComisionProductosListados = totalComisionProductosListados + item.comision;
                totalFacturaProductosListados = totalFacturaProductosListados + item.total;
                totalPrecioConComision = totalPrecioConComision + item.precioconcomision;
                totalFactura = totalFactura + item.total;
            } else {
                totalProductosNoListados = totalProductosNoListados + item.total;
            }
            totalComision = totalComision + item.comision; //totalFactura = totalFactura + item.total;
            totalDescuento = totalDescuento + item.descuento;
        })
        html += '</tbody>'
        html += '</table>'
        $("#tablaDescuentoGeneral").html(html);
        document.getElementById('txtActual').value = totalFactura.toFixed(4);
        document.getElementById('txtComisionActual').value = parseFloat(totalComision - totalDescuento).toFixed(4);
        document.getElementById('totalComisionProductosListados').value = totalComisionProductosListados;
        document.getElementById('totalFacturaProductosListados').value = totalFacturaProductosListados;
        document.getElementById('totalPrecioConComision').value = totalPrecioConComision;
        document.getElementById('txtActualNoListados').value = totalProductosNoListados.toFixed(4);
        $("#ListaProductosDescuento").DataTable({
            pageLength: 5,
            lengthMenu: [5, 12, 18, 24],
            lengthChange: false,
            language: idiomaTabla,
            searching: false
        });
    });
}
//calcula el descuento nuevo a aplicar
function calculateDescuentoGeneral() {
    var totalActual = parseFloat(document.getElementById('txtActual').value);
    var comisionActual = parseFloat(document.getElementById('txtComisionActual').value);
    var porcentajeDescuento = document.getElementById('txtPorcentajeGeneral').value;
    var totalFacturaProductosListados = parseFloat(document.getElementById('totalFacturaProductosListados').value);
    var totalProductosNoListados = parseFloat(document.getElementById('txtActualNoListados').value);
    if (porcentajeDescuento != '') {//si esta diferente de vacio se procede a calcular
        if (!isNaN(porcentajeDescuento))
        {
            if (porcentajeDescuento > 0)
            {//si el porcentaje es mayor a 0 
                var descuento = (totalFacturaProductosListados / 100) * porcentajeDescuento;//sacamos el descuento al total de los productos listados
                if (comisionActual == 0)
                {//si la comision es igual a 0 entonces se saca descuento al total de la factura
                    document.getElementById('txtDescuentoGeneral').value = descuento.toFixed(4);
                    var precioNuevo = (totalActual - descuento) + totalProductosNoListados;
                    document.getElementById('txtTotalNuevo').value = precioNuevo.toFixed(4);
                }
                else
                {//si no se le saca descuento a la comision
                    document.getElementById('txtDescuentoGeneral').value = descuento.toFixed(4);
                    var comisionNueva = comisionActual - descuento;
                    document.getElementById('txtComisionNuevo').value = comisionNueva.toFixed(4);
                    var precioNuevo = (totalActual - descuento) + totalProductosNoListados;//calculamos el nuevo total 
                    document.getElementById('txtTotalNuevo').value = precioNuevo.toFixed(4);
                }
            }
        }
        else
        {
            messeges('warning', 'Solo se admiten valores numericos')
        }
    }
}

//evento que activa la funcion de aplicar descuento
document.getElementById('btnAplicarDescuento').onclick = function () {
    Swal.fire({
        title: 'Aplicar descuento',
        text: '¿Estas seguro que deseas aplicar descuento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Aplicar!'
    }).then((result) => {
        if (result.isConfirmed) {
            aplicarDescuentoGeneral();
        }
    })
}
function aplicarDescuentoGeneral() {
    var txtNombreUsuario = document.getElementById('txtNombreUsuario').value;
    var txtContraseñaUsuario = document.getElementById('txtContraseñaUsuario').value;
    var porcentajeDescuento = document.getElementById('txtPorcentajeGeneral').value;
    if (!(txtNombreUsuario.trim() == '' || txtContraseñaUsuario.trim() == '')) {
        var frm = new FormData();
        frm.append('Nombreusuario', txtNombreUsuario);
        frm.append('Contraseña', txtContraseñaUsuario);
        frm.append('porcentajedescuento', porcentajeDescuento);
        $.ajax({
            url: '/venta/aplicarDescuentoGeneral',
            type: 'POST',
            contentType: false,
            processData: false,
            data: frm,
            success: function (e) {
                if (e == '-1') {
                    messeges('error', 'No tiene permiso para aplicar el descuento')
                } else if (e == '0') {
                    messeges('error', 'Error al aplicar descuento general')
                }
                else {
                    document.getElementById('btnCerrarModalDescuento').click();
                    messeges('success', 'Descuento aplicado');
                    document.getElementById('txtNombreUsuario').value = '';
                    document.getElementById('txtContraseñaUsuario').value = '';
                    document.getElementById('total').value = e;
                }
            }
        })
    } else {
        messeges('warning', 'Usuario y contraseña obligatorios')
    }
}


/*funcion para agregar un producto a la lista de venta(PRUEBA)*/
function addProductToList() {
    if ($('#iidproducto').val() != "") {
        var cantidad = $('#txtCantidad').val() * 1
        var comision = $('#txtComision').val();
        var descuento = $('#txtDescuento').val();
        var subUnidad = $('#subunidad').val();
        var existencias = $('#txtExistencias').val() * 1;
        if (cantidad > 0) {
            if (cantidad <= existencias) {
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
                    url: '/venta/ArmardetalleVenta',
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
                        } else {
                            messeges('error', 'Error en el sistema')
                        }
                    }
                })
            } else {
                messeges('error', 'La cantidad es mayor que la existencia actual');
            }//fin cantidad <= existencias
        } else {
            messeges('warning', 'Cantidad no puede ser 0.');
        }//fin validacio cantidad > 0
    } else {
        messeges('error', 'No haz seleccionado un producto');
    }//fin validacio $('#iidproducto').val() != ""
}