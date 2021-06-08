window.onload = function () {
    callTable();
    llenarCombosFormularioProducto();
}
function contadorDeProductos()
{
    $.get('/producto/TotalProductos', (data) => {
        $('#divTotalProductos').html('<span>Total de registros ' + data + '</span>');
    })
}
function callTable(tipo) {
    var url = '/producto/filtrarProductos';
    var codigo = document.getElementById('filtrarPorCodigo');
    var descripcion = document.getElementById('filtrarPorDescripcion');
    switch (tipo) {
        case 1:
            document.getElementById('tableData').innerHTML = '<span>Cargando...</span>';
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
    paintTable(url, ['código', 'descripción', 'Precio compra', 'iva', 'utilidad', 'precio', 'ex. venta', 'subexistencia', 'precio','fracciones'],
        ['codigoproducto', 'descripcion', 'preciocompra', 'iva', 'ganancia', 'precioventa', 'existencias', 'subexistencia', 'subprecioventa', 'restantes'],
        'iidproducto', 'modalProducto', true, true, false);
    contadorDeProductos();
};

function llenarCombosFormularioProducto() {
    fillCombo('/unidadmedida/listUnidad', 'iidunidadmedida', 'nombreunidad', 'iidunidadmedida');
    fillCombo('/unidadmedida/listUnidad', 'iidunidadmedida', 'nombreunidad', 'subiidunidadmedida');
    fillCombo('/stock/listStock', 'iidstock', 'nombrestock', 'iidstock');
}

function deleteDataOfTheForm() {
    $('#iidproducto').val('');
    $('#codigoproducto').val('');
    $('#iidunidadmedida').val('');
    $('#iidstock').val('');
    $('#descripcion').val('');
    $('#proveedor').val('');
    $('#preciocompra').val(0);
    $('#iva').val('0.0000');
    $('#Precioutilidad').val('0.0000');
    $('#gananciaObtenida').val(1);
    $('#ganancia').val('0.0000');
    $('#precioventa').val('0.0000');
    $('#equivalencia').val(1);
    $('#subpreciocompra').val('0.0000');
    $('#subiva').val(1);
    $('#subPrecioiva').val('0.0000');
    $('#subgananciaObtenida').val(1);
    $('#subganancia').val('0.0000');
    $('#subPrecioiva').val('0.0000');
    $('#subprecioventa').val('0.0000');
    $('#subiidunidadmedida').val('');
    quitarOAgregarClase();
}

function edit(id) {
    deleteDataOfTheForm();
    colorDefault();
    $.get('/producto/getProductoById?id=' + id, function (data) {
        console.log(data);
        $('#iidproducto').val(data.iidproducto);
        $('#codigoproducto').val(data.codigoproducto);
        $('#descripcion').val(data.descripcion);
        $('#iva').val(data.iva);
        $('#preciocompra').val(data.preciocompra);
        var ivaCompra = (data.preciocompra * 0.13) + data.preciocompra;
        document.getElementById('ivaProducto').value = ivaCompra.toFixed(4);
        $('#ganancia').val(data.ganancia);
        $('#precioventa').val(data.precioventa);
        $('#gananciaObtenida').val(data.porcentajeganancia);
        $('#iidunidadmedida').val(data.iidunidadmedida);
        $('#iidstock').val(data.iidstock);
        var precioConUtilidad = parseFloat(data.preciocompra) + parseFloat(data.ganancia);
        $('#Precioutilidad').val(precioConUtilidad.toFixed(4));
    /*obtenemos los datos secundarios*/
        if (data.subunidad > 0) {
            $('#subiidunidadmedida').val(data.subunidad);
            $('#equivalencia').val(data.equivalencia);
            $('#subpreciocompra').val(data.subpreciounitario.toFixed(2));
            $('#subgananciaObtenida').val(data.subporcentaje);
            $('#subiva').val(data.subiva);
            var subprecioConUtilidad = parseFloat(data.subpreciounitario) + parseFloat(data.subganancia);
            $('#subPrecioutilidad').val(subprecioConUtilidad.toFixed(4));
            $('#subganancia').val(data.subganancia);
            $('#subprecioventa').val(data.subprecioventa);
            $('#acordionFactura').collapse({ toggle: true });
        } else {
            $('#subiidunidadmedida').val('');
            $('#equivalencia').val(0);
            $('#subpreciocompra').val(1);
            $('#subgananciaObtenida').val(1);
            $('#subiva').val(1);
            $('#subPrecioutilidad').val(1);
            $('#subganancia').val(1);
            $('#subprecioventa').val(1);
        }
        quitarOAgregarClase();
    })
};

function calculatePrice() {
    var precioCompra = document.getElementById('preciocompra').value;
    var ganancia = document.getElementById('gananciaObtenida').value;
    if (!isNaN(precioCompra)) {
        if (parseFloat(precioCompra) > 0) {
            var ivaCompra = (parseFloat(precioCompra) * 0.13) + parseFloat(precioCompra);
            document.getElementById('ivaProducto').value = ivaCompra.toFixed(4);
            if (parseFloat(ganancia) > 0) {
                //calculo de utilidad
                var utilidad = parseFloat((precioCompra / 100) * ganancia);
                document.getElementById('ganancia').value = utilidad.toFixed(4);
                console.log('Uti '+utilidad);
                console.log('PC '+precioCompra);
                //calculo iva
                var precioMasUtilidad = parseFloat(precioCompra) + parseFloat(utilidad);
                console.log('pMASu ' + precioMasUtilidad);
                //pintamos precio con utilidad
                document.getElementById('Precioutilidad').value = precioMasUtilidad.toFixed(4);
                //caluculamos iva
                var iva = parseFloat(precioMasUtilidad) * 0.13;
                document.getElementById('iva').value = iva.toFixed(4);
                
                var precioFinal = parseFloat(precioCompra) + parseFloat(iva) + parseFloat(utilidad);
                document.getElementById('precioventa').value = precioFinal.toFixed(4);
            } else {
                messeges('warning', 'Sub utilidad debe ser mayor a 0.');
            }
        } else {
            messeges('warning', 'Precio compra no pueden ser menor a 0.');
        }
    } else {
        messeges('warning', 'Precio compra debe ser numerico.');
    }
    if ($('#subiidunidadmedida').val() != null || $('#subiidunidadmedida').val() > 0) {
        calculateSubPrice();
    }
}

function calculateSubPrice() {
    var precioCOmpraOriginal = document.getElementById('preciocompra').value;//capturo el precio original
    var equivalencia = document.getElementById('equivalencia').value;//capturo la equivalencia
    var subprecio = parseFloat(precioCOmpraOriginal) / parseFloat(equivalencia); $('#subpreciocompra').val(subprecio.toFixed(4));//divido el precio original entre la equivalencia
    var precioCompra = document.getElementById('subpreciocompra').value;
    var ganancia = document.getElementById('subgananciaObtenida').value;
    var subiidunidadmedida = document.getElementById('subiidunidadmedida').value;
    if (subiidunidadmedida > 0) {
        if (!isNaN(precioCompra)) {
            if (parseFloat(precioCompra) > 0) {
                if (parseFloat(ganancia) > 0) {
                    //calculo de utilidad
                    var utilidad = parseFloat((precioCompra / 100) * ganancia);
                    document.getElementById('subganancia').value = utilidad.toFixed(4);
                    //calculo iva
                    var precioMasUtilidad = parseFloat(precioCompra) + parseFloat(utilidad);
                    //pintamos precio con utilidad
                    document.getElementById('subPrecioutilidad').value = precioMasUtilidad.toFixed(4);
                    //caluculamos iva
                    var iva = parseFloat(precioMasUtilidad) * 0.13;
                    document.getElementById('subiva').value = iva.toFixed(4);

                    var precioFinal = parseFloat(precioCompra) + parseFloat(iva) + parseFloat(utilidad);
                    document.getElementById('subprecioventa').value = precioFinal.toFixed(4);
                } else {
                    messeges('warning', 'Utilidad debe ser mayor a 0');
                }
            } else {
                messeges('warning', 'Precio compra no pueden ser menor a 0 ');
            }
        } else {
            messeges('warning', 'Precio compra debe ser numérico ');
        }
    }

}

function deleteInfo(id) {
    messegeConfirm('/producto/deleteProducto?id=' + id, 'Eliminar producto',
        '¿Estas seguro que deseas eliminar el producto?','Si! eliminar')
};

function sendData() {
    if (validateEmpty()) {
        var frm = new FormData();
        capturarData(frm);
        if ($('#subiidunidadmedida').val() == $('#iidunidadmedida').val())
            messeges('warning', 'La sub unidad no puede ser igual a la unidad original.');
        else
            guardarProducto('/producto/saveProducto', frm, 'El codigo ingresado ya esta asociado a un producto');
    } else {
        messeges('warning','Llena los campos marcados');
    }
    $('#gananciaObtenida').val(1);
    document.getElementById('gananciaObtenida').value = 1;
};

document.getElementById('subiidunidadmedida').onchange = function () {
    quitarOAgregarClase();   
}

function quitarOAgregarClase() {
    var idSubUnidad = document.getElementById('subiidunidadmedida').value;
    var inputsSubUnidad = document.getElementsByClassName('sub');
    for (var i = 0; i < inputsSubUnidad.length; i++) {
        if (idSubUnidad != '') {
            inputsSubUnidad[i].classList.add('requerid');
            inputsSubUnidad[i].classList.add('data');
        } else {
            inputsSubUnidad[i].classList.remove('requerid');
            inputsSubUnidad[i].classList.remove('data');
        }
    }
}

function guardarProducto(link, data, errorMessage = 'Registro ya existe', error2 = 'Error') {
    $.ajax({
        url: link,
        type: "POST",
        processData: false,
        contentType: false,
        data: data,
        success: function (respuesta) {
            if (respuesta > 0) {
                messeges('success', "exito");
                document.getElementById("btnCerrar").click();
                callTable();
                deleteDataOfTheForm();
            } else if (respuesta == -1) {
                messeges('warning', errorMessage);
            } else if (respuesta == -2) {
                messeges('warning', error2);
            } else {
                messeges('error', "Error de sistema intente mas tarde");
            }
        }
    })
}