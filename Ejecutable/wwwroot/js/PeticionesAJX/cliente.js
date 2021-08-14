window.onload = callTable();
function callTable() {
  paintTable(
    "/cliente/listCliente",
    ["nombre", "dirección", "registro", "giró", "nit"],
    ["nombrecompleto", "direccion", "registro", "giro", "nit"],
    "iidcliente",
    "modalCliente",
    true,
    true
  );
}
$(document).ready(function ($) {
  $("#registro").inputmask("999999-9", { placeholder: "000000-0" });
  $("#nit").inputmask("9999-999999-999-9", {
    placeholder: "0000-000000-000-0",
  });
});
document.getElementById("btnGuardar").onclick = function () {
  if (validateEmpty()) {
    var frm = new FormData();
    capturarData(frm);
    sendDataController("/cliente/saveCliente", frm);
  } else {
    messeges("warning", "Complete los campos marcados");
  }
};
function edit(id) {
  $.get("/cliente/getClienteById?id=" + id, function (data) {
    $("#iidcliente").val(data.iidcliente);
    $("#nombrecompleto").val(data.nombrecompleto);
    $("#direccion").val(data.direccion);
    $("#registro").val(data.registro);
    $("#giro").val(data.giro);
    $("#nit").val(data.nit);
  });
}
function deleteInfo(id) {
  messegeConfirm("/cliente/deleteCliente?id=" + id);
}
