$(function () {
  callTable();
});
function callTable() {
  paintTable(
    "/existencia/listProducto",
    [
      "código",
      "descripción",
      "stock",
      "existencias",
      "subexistencia",
      "fracciones res.",
    ],
    [
      "codigoproducto",
      "descripcion",
      "nombrestock",
      "existencias",
      "subexistencia",
      "restantes",
    ],
    "iidproducto",
    "modalEntrada",
    false,
    true
  );
  fillCombo(
    "/stock/listStock",
    "iidstock",
    "nombrestock",
    "iidstock",
    "",
    "--Seleccione un stock--"
  );
}
function edit(id) {
  $.get("/producto/getProductoById?id=" + id, function (data) {
    $("#nombreproducto").val(data.descripcion);
    $("#iidproducto").val(data.iidproducto);
    $("#codigoProducto").val(data.codigoproducto);
    $("#existenciasproducto").val(data.existencias);
    $("#proveedor").val(data.proveedor);
    $("#preciocompra").val(data.preciocompra);
  });
}
$("#frmEntrada").submit(function (e) {
  e.preventDefault();
  sendData();
});
function sendData() {
  let tipo = document.getElementById("cbxTipoEntrada").value;
  if (!tipo == "") {
    if (validateEmpty()) {
      if ($("#cantidad").val() > 0) {
        document.getElementById("cantidad").style.borderColor = "#ccc";
        var frm = new FormData();
        //capturamos las cantidades y el id de la bodega
        var inputs = document.getElementsByClassName("inputBodegas");
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].value != "") {
            var name = inputs[i].name.replace("bodega", ""); //obtenemos el name del input actual
            frm.append("stock[]", $("#select" + name).val());
            frm.append("bodegas[]", inputs[i].name.replace("bodega", ""));
            frm.append("cantidades[]", inputs[i].value);
          }
        }
        capturarData(frm);
        frm.append("ventas", $("#venta").val());
        frm.append("precioCompra", $("#preciocompra").val() * 1);
        sendDataController("/entrada/saveEntrada", frm);
        limpiarFormulario();
      } else {
        document.getElementById("cantidad").style.borderColor = "red";
        messeges("warning", "La cantidad no puede ser negativo o 0");
      }
    } else {
      messeges("warning", "Llena los campos marcados");
    }
  } else {
    messeges("error", "Selecciona un tipo de entrada");
  }
}

function limpiarFormulario() {
  $("#cbxTipoEntrada").val(""); //vacio el campo de tipo de entrada
  document.getElementById("blockVenta").style.display = "none"; //ocultamos
  document.getElementById("blockCantidad").style.display = "none";
  //ocultamos los demas campos utilizando un array
  var campos = document.getElementsByClassName("factura");
  for (let i = 0; i < campos.length; i++) {
    campos[i].style.display = "none";
  }
  $("#camposBodega").html("");
}
function tipoEntrada() {
  document.getElementById("cantidad").value = "";
  let tipo = parseInt(document.getElementById("cbxTipoEntrada").value);
  let propiedades = document.getElementsByClassName("r");
  let campos = document.getElementsByClassName("factura");
  switch (tipo) {
    case 1: //con factura
      document.getElementById("blockCantidad").style.display = "block";
      document.getElementById("blockVenta").style.display = "block";
      for (let i = 0; i < campos.length; i++) {
        campos[i].style.display = "block";
        propiedades[i].classList.add("requerid");
        propiedades[i].classList.add("data");
      }
      dibujarCamposDeBodega();
      break;

    case 2: //sin factura
      document.getElementById("blockCantidad").style.display = "block";
      document.getElementById("blockVenta").style.display = "block";
      for (let i = 0; i < campos.length; i++) {
        campos[i].style.display = "none";
        propiedades[i].classList.remove("requerid");
        propiedades[i].classList.remove("data");
      }
      dibujarCamposDeBodega();
      break;
    default:
      document.getElementById("blockCantidad").style.display = "none";
      document.getElementById("blockVenta").style.display = "none";
      for (let i = 0; i < campos.length; i++) {
        campos[i].style.display = "none";
      }
      messeges("warning", "Selecciona un tipo de entrada");
      break;
  }
}

function dibujarCamposDeBodega() {
  var html = "";
  var id = "iidstock";
  var lectura = "nombrestock";
  $("#camposBodega").html(html);
  html += '<div class="col-lg-12">';
  html += "<center><h5>Distrubución del producto</h5><center/><hr>";
  html += "</div>";
  //venta

  //listado de bodegas
  $.get("/bodegainventario/listBodega", function (data) {
    if (data.length > 0) {
      $.each(data, function (key, item) {
        html += '<div class="col-lg-3">';
        html += '<div class="form-group">';
        html += "<label>" + item.nombrebodega + ":</label>";
        html +=
          '<input type="text" onkeyup="calcularCantidad()" autocomplete="off" class="form-control data inputBodegas" name="bodega' +
          item.iidbodega +
          '" placeholder="Cantidad a guardar en ' +
          item.nombrebodega +
          '"/>';
        html += "</div>";
        html += "</div>";
        //ubicacion
        html += '<div class="col-lg-3">';
        html += '<div class="form-group">';
        html += "<label>Ubicar en stock:</label>";
        var idSelect = "select" + item.iidbodega;
        html += '<select class="form-control" id="' + idSelect + '">';
        $.get("/entrada/listarStock", function (lstStock) {
          var options = "";
          for (var i = 0; i < lstStock.length; i++) {
            var dataActual = lstStock[i];
            options +=
              '<option value="' +
              dataActual[id] +
              '">' +
              dataActual[lectura] +
              "</option>";
          }
          document.getElementById(idSelect).innerHTML = options;
        });
        html += "</select>";
        html += "</div>";
        html += "</div>";
      });
      //$('#cuerpoModal').append(html);
      $("#camposBodega").html(html);
    } else {
      Swal.fire({
        title: "Vaya!",
        text: "No has creado ninguna bodega, deberias crear una!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          location.href = "/bodegainventario/index";
        } else {
        }
      });
    }
  });
}

function calcularCantidad() {
  var inputs = document.getElementsByClassName("inputBodegas");
  var cantidad = 0;
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value != "" && inputs[i].value != null) {
      if (!isNaN(inputs[i].value)) {
        cantidad += parseInt(inputs[i].value);
        document.getElementById("cantidad").value = cantidad;
      } else {
        messeges("warning", "Solo se admiten numeros");
        return;
      }
    }
  }
}

document.getElementById("btnReportePDF").onclick = function () {
  document.getElementById("btnImprimirReporte").click();
  messeges("success", "Creando reporte");
};
