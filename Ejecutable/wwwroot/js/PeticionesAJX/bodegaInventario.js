/**
 * llama la funcion pintar tabla
 * @param {any} tipo este parametro define cual de las listas se tiene que pintar
 */
function CallTable(tipo) {
  if (tipo == "bodega") {
    pintarTabla(
      "Lista de bodegas",
      "Puedes editar o eliminar las bodegas ya creadas",
      "/bodegainventario/listBodega",
      ["codigo", "nombre"],
      ["iidbodega", "nombrebodega"],
      "iidbodega",
      "bodega"
    );
  } else {
    pintarTabla(
      "Lista del inventariado",
      "Puedes mover los productos entre bodegas o enviarlos a venta",
      "/bodegainventario/listInventario",
      ["codigo", "producto", "bodega", "stock", "cantidad"],
      [
        "codigoproducto",
        "nombreproducto",
        "nombrebodega",
        "nombrestock",
        "cantidad",
      ],
      "iidinventario",
      "inventario"
    );
  }
}
/**
 * esta funcion pinta las tablas con la data que recibe del controlador
 * @param {any} titulo //es el titulo que se mostrara arriba de la tabla
 * @param {any} subtitulo//es una breve descripcion de la tabla
 * @param {any} url//la ruta al controlador
 * @param {any} cabecera//son los th de la tabla
 * @param {any} propiedades//son las propiedades de la entidad
 * @param {any} llavePrimaria//la propiedad que hace de llave primaria para la tabla
 * @param {any} tipo//define cual de las dos entidades es para crear sus respectivas funciones
 */
function pintarTabla(
  titulo,
  subtitulo,
  url,
  cabecera,
  propiedades,
  llavePrimaria,
  tipo
) {
  document.getElementById("tablaGenerica").innerHTML =
    "<span>Cargando lista...</span>";
  $.get(url, function (data) {
    let html = "";
    html += "<h5>" + titulo + "</h5>";
    html += "<span>" + subtitulo + "</span><hr>";
    html +=
      '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="tablaGenerada">';
    html += '<thead class="thead-dark">';
    html += "<tr>";
    for (let i = 0; i < cabecera.length; i++) {
      html += "<th>" + cabecera[i].toUpperCase() + "</th>";
    }
    html += "<th>OPCIONES</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    for (let i = 0; i < data.length; i++) {
      let dataActual = data[i];
      html += "<tr>";
      for (let j = 0; j < propiedades.length; j++) {
        let propiedadActual = propiedades[j];
        html += "<td>" + dataActual[propiedadActual] + "</td>";
      }
      html += "<td>";
      if (tipo == "bodega") {
        //si es bodega
        html +=
          '<a class="btn-sm btn-success" href="#" onclick="editarBodega(' +
          dataActual[llavePrimaria] +
          ')" data-toggle="modal" data-target="#modalGenerico"><i class="fas fa-edit"></i></a> ';
        html +=
          '<a class="btn-sm btn-danger" href="#" onclick="eliminar(' +
          dataActual[llavePrimaria] +
          ',true)"><i class="fas fa-trash"></a>';
      } else {
        //si es inventario
        if (dataActual["cantidad"] > 0) {
          //si la cantidad es mayor a 0 se podra mover entre inventarios
          html +=
            '<a class="btn-sm btn-success" href="#" onclick="moverProducto(' +
            dataActual[llavePrimaria] +
            ')" data-toggle="modal" data-target="#modalMoverProducto">Mover <i class="fas fa-people-carry"></i></a> ';
        } else {
          //de lo contrario se bloquea el boton
          html +=
            '<button class="btn-sm btn-success">Mover <i class="fas fa-people-carry"></i></button> ';
        }
        html +=
          '<a class="btn-sm btn-danger" href="#" onclick="eliminarInventario(' +
          dataActual[llavePrimaria] +
          ')">Eliminar <i class="fas fa-trash"></i></a> ';
        html +=
          '<a class="btn-sm btn-success" href="#" onclick="editarCantidadProducto(' +
          dataActual[llavePrimaria] +
          ')" data-toggle="modal" data-target="#modalEditarCantidad" title="Edita las existencias">Editar <i class="fas fa-edit"></i></a> ';
      }
      html += "</td>";
      html += "</tr>";
    }
    html += "</tbody>";
    html += "</table>";
    document.getElementById("tablaGenerica").innerHTML = html;
    $("#tablaGenerada").DataTable({
      pageLength: 5,
      lengthMenu: [5, 10, 15, 20],
      language: idiomaTabla,
    });
  });
}
/**
 * esta funcion es para cambiar el nombre de la bodega
 * @param {any} id//pasamos el id de la bodega
 */
function editarBodega(id) {
  $.get("/bodegainventario/obtenerBodega?id=" + id, function (data) {
    $("#iidbodega").val(data.iidbodega);
    $("#nombrebodega").val(data.nombrebodega);
  });
}
/*
 guarda una nueva bodega
 */
document.getElementById("btnGuardar").onclick = function () {
  if (validarCamposVacios()) {
    let frm = new FormData();
    capturarLaInformacion(frm);
    guardar("/bodegaInventario/GuardarBodega", frm);
  } else {
    messeges("warning", "Complete los campos marcados");
  }
};
/**
 * funcion para eliminar un registro
 * @param {any} id//pasamos la llave foranea
 * @param {any} EsBodega//parametro para validar si es bodega o inventario lo que eliminaremos
 */
function eliminar(id, EsBodega) {
  if (EsBodega) {
    ConfirmarEliminacion("/bodegainventario/eliminarBodega?id=" + id, EsBodega);
  } else {
  }
}
/**
 * funcion para confirmar que queremos eliminar el registro
 * @param {any} url//ruta del controlador
 * @param {any} EsBodega//parametro para validar si es bodega o inventario lo que eliminaremos
 * @param {any} texto//mensaje que se le mostrara al usuario
 * @param {any} titulo//titulo del mensaje
 */
function ConfirmarEliminacion(
  url,
  EsBodega,
  texto = "¿Estas seguro que deseas eliminar este registro?",
  titulo = "Eliminar registro!"
) {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Eliminar!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.get(url, function (respuesta) {
        if (respuesta == "ok") {
          messeges("success", "Registro eliminado");
          if (EsBodega) {
            CallTable("bodega");
          } else {
            CallTable("inventario");
          }
        } else if ("utilizada") {
          if (EsBodega) {
            messeges(
              "warning",
              "No se pudo eliminar, esta bodega esta en uso",
              2500
            );
          } else {
            messeges(
              "warning",
              "No se pudo eliminar, este inventario tiene existencias",
              2500
            );
          }
        } else {
          messeges("error", respuesta);
        }
      });
    }
  });
}
/**
 * mensaje de confirmacion, advertencia o error
 * @param {any} icons//mandamos el icono ya sea success, error, warning
 * @param {any} titles//el texto que queremos que se muestre
 * @param {any} time//el tiempo que debe durar el mensaje visible
 */
function messeges(icons = "success", titles = "Exito", time = 1500) {
  Swal.fire({
    position: "center",
    icon: icons,
    title: titles,
    showConfirmButton: false,
    timer: time,
  });
}
/**
 * funcion que envia la data al controlador
 * @param {any} link//ruta del controladro
 * @param {any} frm//la data que se enviara a guardar
 */
function guardar(link, frm) {
  $.ajax({
    url: link,
    type: "POST",
    contentType: false,
    processData: false,
    data: frm,
    success: function (respuesta) {
      if (respuesta == "ok") {
        limpiarCampos();
        messeges();
        document.getElementById("btnCerrar").click();
        document.getElementById("tablaGenerica").innerHTML = "";
        CallTable("bodega");
      } else if (respuesta == "rept") {
        messeges("warning", "Este registro ya existe");
      } else {
        messeges("success", respuesta);
      }
    },
  });
}
/* 
 esta funcion valida que los campos que tengan la clase requerid no esten vacios
 */
function validarCamposVacios() {
  let inputs = document.getElementsByClassName("requerid");
  let rpt = true;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      rpt = false;
      inputs[i].style.borderColor = "red";
    } else {
      inputs[i].style.borderColor = "#ccc";
    }
  }
  return rpt;
}
/*
 esta funcion limpia todos los controles que tengan la clase form-control*/
function limpiarCampos() {
  let inputs = document.getElementsByClassName("form-control");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].style.borderColor = "#ccc";
    inputs[i].value = "";
  }
}
/**
 * captura toda la informacion que se escriban en los controles que tengan la clase data
 * @param {any} frm//objeto de la clase FormData()
 */
function capturarLaInformacion(frm) {
  let inputs = document.getElementsByClassName("data");
  for (let i = 0; i < inputs.length; i++) {
    frm.append(inputs[i].name, inputs[i].value.toUpperCase());
  }
  frm.append("bhabilitado", "A");
}
/**
 * pinta la data que se obtenga de la bodega
 * @param {any} id//llave primaria del registro que requerimos pintar
 */
function moverProducto(id) {
  $.get("/bodegainventario/obtenerInventario?id=" + id, function (data) {
    document.getElementById("txtiidbodega").value = data.iidbodega;
    document.getElementById("txtiidinventario").value = data.iidinventario;
    document.getElementById("bodega").value = data.nombrebodega;
    document.getElementById("existencia").value = data.cantidad;
    document.getElementById("producto").value = data.nombreproducto;
    document.getElementById("txtiidproducto").value = data.iidproducto;
    document.getElementById("stock").value = data.nombrestock;
    llenarCombo(data.iidbodega);
  });
}
/**
 * pinta la data en los select
 * @param {any} idBodega//la llave foranea de la entidad
 */
function llenarCombo(idBodega) {
  $.get("/bodegainventario/listBodegaSelect?id=" + idBodega, function (data) {
    let html = "";
    html += '<option value="">--Selecciona una opción--</option>';
    html += '<option value="-1">SALA VENTA</option>';
    $.each(data, function (key, item) {
      html +=
        '<option value="' +
        item.iidbodega +
        '">' +
        item.nombrebodega +
        "</option>";
    });
    document.getElementById("cbxBodega").innerHTML = html;
  });
}
/*
 *mueve las exitencias entre bodegas o la sala de venta
 * */
function moverCantidadProducto() {
  if (!($("#cantidadMover").val() == "" || $("#cbxBodega").val() == "")) {
    document.getElementById("cantidadMover").style.borderColor = "#ccc";
    document.getElementById("cbxBodega").style.borderColor = "#ccc";
    let cantidad = parseInt($("#cantidadMover").val());
    let existencia = parseInt($("#existencia").val());
    if (cantidad > 0 && cantidad <= existencia) {
      let obj = new FormData();
      obj.append("cantidad", $("#cantidadMover").val());
      obj.append("bodegaActual", $("#txtiidbodega").val());
      obj.append("producto", $("#txtiidproducto").val());
      obj.append("ubicacionnueva", $("#cbxBodega").val());
      if ($("#cbxBodega").val() > 0) {
        obj.append("stock", $("#cbxStock").val());
      }
      $.ajax({
        url: "/bodegainventario/moverproducto",
        contentType: false,
        type: "POST",
        processData: false,
        data: obj,
        success: function (respuesta) {
          if (respuesta == "ok") {
            messeges("success", "Se movio correctamente");
            document.getElementById("btnCerrar2").click();
            CallTable("inventario");
            limpiarFormularioMover();
          } else {
            messeges("error", respuesta);
          }
        },
      });
    } else {
      messeges(
        "warning",
        "La cantidad a mover tiene que estar en el rango 1-" +
          $("#existencia").val()
      );
    }
  } else {
    document.getElementById("cantidadMover").style.borderColor = "red";
    document.getElementById("cbxBodega").style.borderColor = "red";
    messeges("warning", "Complete los campos marcados");
  }
}
function limpiarFormularioMover() {
  $("#cantidadMover").val("1");
  $("#txtiidinventario").val("");
  $("#txtiidbodega").val("");
  $("#txtiidproducto").val("");
  document.getElementById("divStock").innerHTML = "";
}
function verificarSiEsBodega() {
  let value = document.getElementById("cbxBodega").value;
  if (value > 0) {
    $.get("/entrada/listarStock", function (lstStock) {
      let html = "";
      html += "<label>Colocar en el stock:</label>";
      html += '<select id="cbxStock" class="form-control">';
      $.each(lstStock, function (key, item) {
        html +=
          '<option value="' +
          item.iidstock +
          '">' +
          item.nombrestock +
          "</option>";
      });
      html += "</select>";
      document.getElementById("divStock").innerHTML = html;
    });
  } else {
    document.getElementById("divStock").innerHTML = "";
  }
}
function eliminarInventario(id) {
  ConfirmarEliminacion(
    "/bodegainventario/eliminarInventario?id=" + id,
    false,
    "Recuerda que si tiene existencias se perderan al eliminar!",
    "Eliminar inventario!"
  );
}
//pinta la data de una entidad
function editarCantidadProducto(id) {
  $.get("/bodegainventario/obtenerInventario?id=" + id, function (data) {
    $("#txtinventario").val(data.iidinventario);
    $("#txtproducto").val(data.nombreproducto);
    $("#txtbodega").val(data.nombrebodega);
    $("#txtstock").val(data.nombrestock);
    $("#txtcantidad").val(data.cantidad);
  });
}
//cambia la cantidad de producto de una determinada bodega
function cambiarCantidadProducto() {
  if (!isNaN($("#txtcantidad").val())) {
    if ($("#txtcantidad").val() >= 0) {
      Swal.fire({
        title: "Editar registro!",
        text: "¿Estas seguro que deseas cambiar la cantidades de este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Cambiar!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.get(
            "/bodegainventario/editarExistenciaInventario?id=" +
              $("#txtinventario").val() +
              "&cantidad=" +
              $("#txtcantidad").val(),
            function (respuesta) {
              if (respuesta == "ok") {
                messeges("success", "Registro modificado");
                CallTable("inventario");
                document.getElementById("btnCerrar3").click();
              } else {
                messeges("error", respuesta);
              }
            }
          );
        }
      });
    } else {
      messeges("error", "La cantidad no puede ser negativo");
    }
  } else {
    messeges("error", "La cantidad debe ser numerico");
  }
}

//sala de venta
function listarProductos() {
  $.get("/BodegaInventario/listarProductos", function (data) {
    let html = "";
    html += "<h5>Lista del inventario de sala de ventas</h5>";
    html +=
      "<span>Aqui se muestran todos los productos que estan en sala de venta</span><hr>";
    html +=
      '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="tablaGenerada">';
    html += '<thead class="thead-dark">';
    html += "<tr>";
    html += "<th>CODIGO</th>";
    html += "<th>PRODUCTO</th>";
    html += "<th>BODEGA</th>";
    html += "<th>STOCK</th>";
    html += "<th>CANTIDAD</th>";
    html += "<th>OPCIONES</th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    $.each(data, function (key, item) {
      html += "<tr>";
      html += "<td>" + item.codigoproducto + "</td>";
      html += "<td>" + item.descripcion + "</td>";
      html += "<td>SALA DE VENTA</td>";
      html += "<td>" + item.nombrestock + "</td>";
      html += "<td>" + item.existencias + "</td>";
      html += "<td>";
      html +=
        '<a title="Cambiar existencias" class="btn-sm btn-success" href="#" data-toggle="modal" onclick="existencia(' +
        item.iidproducto +
        ')" data-target="#modalExistencia"><i class="fas fa-edit"></i></a>';
      html += "</td>";
      html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";

    document.getElementById("tablaGenerica").innerHTML = html;
    $("#tablaGenerada").DataTable({
      pageLength: 5,
      lengthMenu: [5, 10, 15, 20],
      language: idiomaTabla,
    });
  });
}
function existencia(id) {
  $.get("/producto/getProductoById?id=" + id, function (data) {
    $("#Existiidproducto").val(data.iidproducto);
    $("#txtcodigoproducto").val(data.codigoproducto);
    $("#txtdescripcion").val(data.descripcion);
    $("#txtexistencia").val(data.existencias);
  });
}
function modificarExistencia() {
  if ($("#txtexistencia").val() >= 0) {
    Swal.fire({
      title: "Modificar existencias",
      text: "Esta operación afectara tu inventario en sala de venta! ¿Estas seguro que deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si cambiar!",
    }).then((result) => {
      if (result.isConfirmed) {
        let obj = new FormData();
        obj.append("Iidproducto", $("#Existiidproducto").val());
        obj.append("Existencias", $("#txtexistencia").val());
        $.ajax({
          url: "/bodegainventario/modificarexistenciaproducto",
          type: "POST",
          contentType: false,
          processData: false,
          data: obj,
          success: function (resp) {
            if (resp == "ok") {
              document.getElementById("btnSalaDeVenta").click();
              document.getElementById("btnCerrarExistencia").click();
              messeges("success", "Producto modificado");
            } else {
              messeges("error", "Ocurrio el siguiente error: " + resp);
            }
          },
        });
      }
    });
  } else {
    messeges("warning", "Existencia no puede ser negativo");
  }
}
