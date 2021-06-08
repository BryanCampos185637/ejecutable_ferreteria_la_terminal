window.onload = obtenerData();
function obtenerData() {
    $.get('/configuracion/getConfiguration', function (data) {
        $('#txtIF').val(data.iniciofactura);
        $('#txtFF').val(data.finfactura);
        $('#txtIC').val(data.iniciocotizacion);
        $('#txtFC').val(data.fincotizacion);
        $('#txtAC').val(data.noactualcotizacion);
        $('#txtAF').val(data.noactualfactura);
        $('#txtDF').val(data.nodigitosfactura);
        $('#txtDC').val(data.nodigitoscotizacion);

        $('#txtICF').val(data.iniciocreditofiscal);
        $('#txtACF').val(data.noactualcreditofiscal);
        $('#txtFCF').val(data.fincreditofiscal);
        $('#txtDCF').val(data.nodigitoscreditofiscal);
    })
}
function saveConfiguracion() {
    if (validateEmpty()) {
        if (validate()) {
            var frm = new FormData();
            frm.append('iniciofactura', $('#txtIF').val());
            frm.append('noactualfactura', $('#txtIF').val());
            frm.append('finfactura', $('#txtFF').val());
            frm.append('iniciocotizacion', $('#txtIC').val());
            frm.append('noactualcotizacion', $('#txtIC').val());
            frm.append('fincotizacion', $('#txtFC').val());
            frm.append('nodigitosfactura', $('#txtDF').val());
            frm.append('nodigitoscotizacion', $('#txtDC').val());
            frm.append('usuario', $('#txtUser').val());
            frm.append('contra', $('#txtPass').val());

            frm.append('iniciocreditofiscal', $('#txtICF').val());
            frm.append('noactualcreditofiscal', $('#txtICF').val());
            frm.append('fincreditofiscal', $('#txtFCF').val());
            frm.append('nodigitoscreditofiscal', $('#txtDCF').val());
            $.ajax({
                url: '/configuracion/updateConfiguracion',
                type: "POST",
                processData: false,
                contentType: false,
                data: frm,
                success: function (respuesta) {
                    if (respuesta > 0) {
                        obtenerData();
                        colordefault();
                        $('#txtUser').val(''); $('#txtPass').val('');//limpiamos los inputs
                        Swal.fire({
                            title: 'Exito',
                            text: 'Configuración guardada',
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.href = '/configuracion/index';
                            } else {
                                location.href = '/configuracion/index';
                            }
                        })
                    } else if (respuesta==-1) {
                        messeges('warning','No tienes permisos para modificar');
                    } else {
                        messeges("error","Error de sistema intente más tarde");
                    }
                }
            })
        } else {
            messeges('warning','Los campos no pueden ir en valor 0 o negativos.')
        }
    } else {
        messeges('warning','Todos los datos son necesarios');
    }
}
function validateEmpty() {
    var rpt = true;
    var inputs = document.getElementsByClassName("r");
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
function validate() {
    var rpt = true;
    var inputs = document.getElementsByClassName('r');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value <= 0) {
            rpt = false;
            inputs[i].style.borderColor = "red";
        } else {
            inputs[i].style.borderColor = "#ccc";
        }
    }
    return rpt;
}
function colordefault() {
    var inputs = document.getElementsByClassName("r");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.borderColor = "#ccc";
    }
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