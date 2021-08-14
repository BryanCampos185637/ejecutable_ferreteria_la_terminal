window.onload = callTable();
function callTable() {
  paintTable(
    "/unidadmedida/listUnidad",
    ["Nombre"],
    ["nombreunidad"],
    "iidunidadmedida",
    "modalUnidad",
    true,
    true
  );
}
function save() {
  if (validateEmpty()) {
    var frm = new FormData();
    capturarData(frm);
    sendDataController("/unidadmedida/saveUnidad", frm);
  } else {
    messeges("warning", "El nombre es requerido");
  }
}
function edit(id) {
  $.get("/unidadmedida/getUnidadById?id=" + id, function (data) {
    $("#iidunidadmedida").val(data.iidunidadmedida);
    $("#nombreunidad").val(data.nombreunidad);
  });
}
function deleteInfo(id) {
  messegeConfirm("/unidadmedida/deleteUnidad?id=" + id);
}
