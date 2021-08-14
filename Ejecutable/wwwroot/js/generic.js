/*
link: la url del controlador
data: es el objeto que se mandara a guardar
errorMessage: mensaje en caso de que ocurra un error
error2: mensaje de validaciones
*/
function sendDataController(
  link,
  data,
  errorMessage = "Registro ya existe",
  error2 = "El nombre usuario ya esta en uso"
) {
  $.ajax({
    url: link,
    type: "POST",
    processData: false,
    contentType: false,
    data: data,
    success: function (respuesta) {
      if (respuesta > 0) {
        messeges("success", "exito");
        document.getElementById("btnCerrar").click();
        callTable();
        clearData();
      } else if (respuesta == -1) {
        messeges("warning", errorMessage);
      } else if (respuesta == -2) {
        messeges("warning", error2);
      } else {
        messeges("error", "Error de sistema intente mas tarde");
      }
    },
  });
}
/*
link: url del controlador
headboard: cabecera de la tabla
properties:propiedades de la entidad
primaryKey: llave foranea de la entidad
idModal: el identificador del modal que servira para editar la informacion
optionDelete: define si estara visble el boton de eliminar
optionEdit: define si estara visble el boton de editar
buscador: define si se usara el buscador de datatable o uno programado en el backend
*/
function paintTable(
  link,
  headboard,
  properties,
  primaryKey,
  idModal,
  optionDelete = true,
  optionEdit = true,
  buscador = true
) {
  fetch(window.location.protocol + "//" + window.location.host + link)
    .then((p) => p.json())
    .then((data) => {
      var html = "";
      html +=
        '<table class="table table-hover table-bordered table-responsive-lg table-responsive-md table-responsive-sm" id="pagination">';
      html += '<thead class="thead-dark">';
      html += '<tr class="text-center">';
      var i = 0;
      while (i < headboard.length) {
        html += "<th>" + headboard[i].toUpperCase() + "</th>";
        i++;
      }
      if (optionDelete != false || optionEdit != false) {
        html += "<th>OPCIONES</th>";
      }
      html += "</tr>";
      html += "</thead>";
      html += "<tbody>";
      for (var c = 0; c < data.length; c++) {
        html += '<tr class="">';
        var objectCurret = data[c];
        for (var f = 0; f < properties.length; f++) {
          var propertyCurret = properties[f];
          if (
            objectCurret[propertyCurret] != null &&
            objectCurret[propertyCurret] != -1000
          ) {
            html += "<td>" + objectCurret[propertyCurret] + "</td>";
          } else {
            html +=
              '<td class="text-center"><i class="fas fa-exclamation"></i></td>';
          }
        }
        if (optionDelete != false || optionEdit != false) {
          html += "<td>";
          if (optionDelete)
            html +=
              '<a title="Eliminar" class="btn-sm btn-danger" href="#" onclick="deleteInfo(' +
              objectCurret[primaryKey] +
              ')"><i class="fas fa-trash"></i></a> ';
          if (optionEdit)
            html +=
              '<a title="Editar" class="btn-sm btn-success" href="#" data-toggle="modal" onclick="edit(' +
              objectCurret[primaryKey] +
              ')" data-target="#' +
              idModal +
              '"><i class="fas fa-edit"></i></a>';
          html += "</td>";
        }
        html += "</tr>";
      }
      html += "</tbody>";
      html += "</table>";
      document.getElementById("tableData").innerHTML = html;
      $("#pagination").DataTable({
        searching: buscador,
        pageLength: 5,
        lengthChange: false,
        lengthMenu: [5, 8, 10, 15, 20],
        aaSorting: [],
        ordering: false,
        language: idiomaTabla,
      });
    });
}
/*
funcion que valdia que los campos requeridos no vayan vacios
toma todos los input select y textarea con la clase requerid
*/
function validateEmpty() {
  var rpt = true;
  var inputs = document.getElementsByClassName("requerid");
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
/*
funcion que captura los datos de la vista
toma todos los controles que tengan la clase data
*/
function capturarData(frm) {
  var dataVista = document.getElementsByClassName("data"); //recoje todos los que tengan la clase data
  for (var i = 0; i < dataVista.length; i++) {
    //itera todos los inputs
    if (dataVista[i].name != "contraseña") {
      frm.append(dataVista[i].name, dataVista[i].value.trim().toUpperCase()); // y forma el arreglo
    } else {
      frm.append(dataVista[i].name, dataVista[i].value.trim()); // y forma el arreglo
    }
  }
  frm.append("bhabilitado", "A");
}
/*
limpia los formularios recoge todo los inputs con la clase form-control
*/
function clearData() {
  var dataVista = document.getElementsByClassName("form-control"); //recoje todos los que tengan la clase data
  for (var i = 0; i < dataVista.length; i++) {
    //itera todos los inputs
    dataVista[i].value = "";
    dataVista[i].style.borderColor = "#ccc";
  }
}
/*
regresa al color por defecto de los controles
*/
function colorDefault() {
  var dataVista = document.getElementsByClassName("form-control"); //recoje todos los que tengan la clase data
  for (var i = 0; i < dataVista.length; i++) {
    //itera todos los inputs
    dataVista[i].style.borderColor = "#ccc";
  }
}
/*
funcion para llenar los select 
link:url del controladro
value: este es el valor de la propiedad que se recogera del option
text: lo que se le mostrara al usuario
idSelect: el identificador del controlador que se afectara
description: este parametro se ocupa cuando haya una descripcion del text
information: el primer option que se le mostrara al usuario
*/
function fillCombo(
  link,
  value,
  text,
  idSelect,
  description = "",
  information = "Selecciona uno"
) {
  $.get(link, function (data) {
    if (data != null || data != "") {
      var html = '<option value="">' + information + "</option>";
      for (var i = 0; i < data.length; i++) {
        var objectCurret = data[i];
        if (description == "")
          html +=
            '<option value="' +
            objectCurret[value] +
            '">' +
            objectCurret[text] +
            "</option>";
        else
          html +=
            '<option value="' +
            objectCurret[value] +
            '">' +
            objectCurret[text] +
            "<- " +
            objectCurret[description] +
            "</option>";
      }
      $("#" + idSelect).html(html);
    } else {
      var html = '<option value="">--No hay registros--</option>';
      $("#" + idSelect).html(html);
    }
  });
}
/*
mensaje de confirmacion
*/
function messeges(icons = "success", titles = "Exito") {
  Swal.fire({
    position: "center",
    icon: icons,
    title: titles,
    showConfirmButton: false,
    timer: 1500,
  });
}
/*
funcion que envia a eliminar un registro
url: es la ruta del controlador
mensaje: el titulo del mensaje
subtitulo: es el texto de advertencia para el usuario
tituloBoton: lo que dira el boton de success
mensajeErrorValidacion: mensaje de validaciones
*/
function messegeConfirm(
  url,
  mensaje = "Eliminar",
  subtitulo = "¿Estas seguro que deseas eliminar el registro?",
  tituloBoton = "Si, eliminar!",
  mensajeErrorValidacion = ""
) {
  Swal.fire({
    title: mensaje,
    text: subtitulo,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: tituloBoton,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteData(url, mensajeErrorValidacion);
    }
  });
}
/*
obtiene la data del controlador
*/
function getDataById(link, properties) {
  $.get(link, function (data) {
    var dataActual = data;
    for (var i = 0; i < properties.length; i++) {
      $("#" + properties[i]).val(dataActual[properties[i]]);
    }
  });
}
/*
elimina un registro
link: url del ontrolador
mensajeErrorValidacion: mensaje de validacion
*/
function deleteData(link, mensajeErrorValidacion = "") {
  $.get(link, function (rpt) {
    if (rpt > 0) {
      messeges("success", "Registro eliminado");
      callTable();
    } else if (rpt == -1) {
      messeges("error", mensajeErrorValidacion);
    } else {
      messeges("error", "Error en el sistema");
    }
  });
}
