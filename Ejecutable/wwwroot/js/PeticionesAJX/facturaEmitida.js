document.getElementById('btnFiltrar').onclick = function () {
    try {
        document.getElementById('tableData').innerHTML = '<span>Cargando...</span>';
        let fecha = document.getElementById('txtFecha').value;
        filtrarFacturas(fecha, '');
    } catch (error) {
        messeges('error', error);
    }
}

function filtrarFacturas(fecha = '', opcion = '') {
    if (opcion == '') {
        paintTable('/facturaemitida/filtrarFactura?fecha=' + fecha, ['NO FACTURA', 'VENDEDOR', 'CLIENTE', 'TIPO COMPRADOR', 'FECHA CREACION', 'TOTAL'],
            ['nofactura', 'nombrevendedor', 'nombrecomprador', 'tipocomprador', 'fechaemitida', 'total'], 'iidfactura', 'modalFactura', false, true);
    } else {
        paintTable('/facturaemitida/filtrarFacturaEnEspera', ['NO FACTURA', 'VENDEDOR', 'CLIENTE', 'TIPO COMPRADOR', 'FECHA CREACION', 'TOTAL'],
            ['nofactura', 'nombrevendedor', 'nombrecomprador', 'tipocomprador', 'fechaemitida', 'total'], 'iidfactura', 'modalFactura', false, true);
    }
}

function edit(id) {
    try {
        $.get('/factura/getFacturaById?id=' + id, function (data) {
            document.getElementById('titulo').innerHTML = '<h3 class="modal-title">Factura No. ' + data.nofactura + '</h3>';
            $('#iidfactura').val(data.iidfactura);
            document.getElementById('efectivo').value = data.efectivo;
            document.getElementById('infoFactura').innerHTML = `
                    <tbody>
                        <tr>
                            <td>Vendido por: ${data.nombrevendedor}</td>
                            <td>Comprador: ${data.nombrecomprador}</td>
                            <td>Tipo comprador: ${data.tipocomprador}</td>
                            <td>Dirección: ${data.direccion}</td>
                        </tr>
                        <tr>
                            <td>Giró: ${data.giro}</td>
                            <td>NIT: ${data.nit}</td>
                            <td>Comisión: $${data.totalcomision}</td>
                            <td>Descuento: $${data.totaldescuento}</td>
                        </tr>
                        <tr>
                            <td>% desc. a factura: ${data.porcentajedescuento}</td>
                            <td>Descuento a factura: $${data.descuentogeneral}</td>
                            <td>Total: $${data.total}</td>
                            <td>Efectivo: $${data.efectivo}</td>
                        </tr>
                        <tr>
                            <td>Cambio: $${data.cambio}</td>
                        </tr>
                </tbody>`;

            if (data.original == 'NO') {
                var html = '';
                html += '<button type="button" onclick="addIdFacturaCookie(true)" class="btn-sm btn-primary">';
                html += '<i class="fas fa-print"></i> Imprimir';
                html += '</button>';
                document.getElementById('divImprimir').innerHTML = html;
            } else {
                document.getElementById('divImprimir').innerHTML = '';
            }
        });
        $.get('/factura/getDetallePedidoByIidfactura?id=' + id, function (lst) {
            var html = '';
            html += '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id = "listProductsFactura">';
            html += '<thead class="thead-dark">';
            html += '<tr>';
            html += '<th>PRODUCTO</th>';
            html += '<th>CANTIDAD</th>';
            html += '<th>UM</th>';
            html += '<th>PRECIO</th>';
            html += '<th>COMISION</th>';
            html += '<th>DESCUENTO</th>';
            html += '<th>SUBTOTAL</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            $.each(lst, function (obj, item) {
                html += '<tr>';
                html += '<td>' + item.nombreproducto + '</td>';
                html += '<td>' + item.cantidad + '</td>';
                if (item.subproducto == 'NO') {
                    html += '<td>' + item.unidadmedida + '</td>';
                } else {
                    html += '<td>' + item.nombresubunidad + '</td>';
                }
                html += '<td>' + item.preciounitario + '</td>';
                html += '<td>' + item.comision + '</td>';
                html += '<td>' + item.descuento + '</td>';
                html += '<td>' + item.total + '</td>';
                html += '</tr>';
            });
            html += '</tbody>';
            html += '</table>';
            document.getElementById('tabla').innerHTML = html;
            $('#listProductsFactura').DataTable({
                pageLength: 3,
                lengthMenu: [3, 12, 18, 24],
                language: idiomaTabla
            });
        });
    } catch (error) {
        messeges('error', error);
    }
}

function addIdFacturaCookie(esOriginal = true) {
    let efectivo = document.getElementById('efectivo').value;
    if (efectivo != '') {
        efectivo = efectivo * 1;
        var id = document.getElementById('iidfactura').value;
        $.get('/factura/addIdFacturaCookie?id=' + id + '&esOriginal=' + esOriginal + '&efectivo=' + efectivo, function (r) {
            if (r) {
                messeges('success', 'Creando factura')
                document.getElementById('btnImprimiFactura').click();
            } else {
                messeges('error', 'Error al crear la factura');
            }
        })
    } else {
        messeges('warning', 'Efectivo obligatorio')
    }
}