function saveConfiguracion() {
    if (validateEmpty()) {
        if (validate()) {
            var txtIF = document.getElementById('txtIF').value * 1;
            var txtFF = document.getElementById('txtFF').value * 1;
            if (txtIF < txtFF) {
                document.getElementById('txtIF').style.borderColor = '#ccc';
                var txtIC = document.getElementById('txtIC').value * 1;
                var txtFC = document.getElementById('txtFC').value * 1;
                if (txtIC < txtFC) {
                    var frm = new FormData();
                    frm.append('iniciofactura', $('#txtIF').val());
                    frm.append('noactualfactura', $('#txtIF').val());
                    frm.append('finfactura', $('#txtFF').val());
                    frm.append('iniciocotizacion', $('#txtIC').val());
                    frm.append('noactualcotizacion', $('#txtIC').val());
                    frm.append('fincotizacion', $('#txtFC').val());
                    frm.append('nodigitosfactura', $('#txtDF').val());
                    frm.append('nodigitoscotizacion', $('#txtDC').val());

                    frm.append('iniciocreditofiscal', $('#txtICF').val());
                    frm.append('noactualcreditofiscal', $('#txtICF').val());
                    frm.append('fincreditofiscal', $('#txtFCF').val());
                    frm.append('nodigitoscreditofiscal', $('#txtDCF').val());
                    $.ajax({
                        url: '/home/createConfiguracion',
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: frm,
                        success: function (respuesta) {
                            if (respuesta > 0) {
                                Swal.fire({
                                    title: 'Exito',
                                    text: 'Configuracion guardada',
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        location.href = '/home/index';
                                    } else {
                                        location.href = '/home/index';
                                    }
                                })
                            } else {
                                messeges('error',"Error de sistema intente más tarde");
                            }
                        }
                    })
                } else {
                    document.getElementById('txtIC').style.borderColor = 'red';
                    messeges('warning','El inicio de la cotización no puede ser mayor que el final.');
                }
            } else {
                document.getElementById('txtIF').style.borderColor = 'red';
                messeges('warning','El inicio de la factura no puede ser mayor que el final.');
            }
        } else {
            messeges('warning','Los campos no pueden ir en valor 0 o negativos.')
        }
    } else {
        messeges('warning','Todos los datos son necesarios');
    }
}
function validateEmpty() {
    var rpt = true;
    var inputs = document.getElementsByClassName("form-control");
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
    var inputs = document.getElementsByClassName('form-control');
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