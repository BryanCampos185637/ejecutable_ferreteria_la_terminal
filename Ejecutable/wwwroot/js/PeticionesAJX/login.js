$("#frmLogin").submit(function (e) {
  e.preventDefault();
  login();
});
function login() {
  if (validateEmpty()) {
    document.getElementById("mensaje").innerHTML =
      '<div class="text-center"><span class="text-primary">Cargando...</span></div>';
    var frm = new FormData();
    frm.append("nombreusuario", $("#txtUsuario").val());
    frm.append("contraseña", $("#txtContraseña").val());
    $.ajax({
      url: "/Login/validation",
      type: "POST",
      contentType: false,
      processData: false,
      data: frm,
      success: function (r) {
        switch (r) {
          case 0:
            document.getElementById("mensaje").innerHTML =
              '<div class="text-center"><span class="text-danger">Credenciales incorrectas...</span></div>';
            break;
          case 1:
            location.href = "/Home/Index";
            break;
          case -1:
            document.getElementById("mensaje").innerHTML =
              '<div class="text-center"><span class="text-danger">Cuenta vetada...</span></div>';
            break;
          default:
            document.getElementById("mensaje").innerHTML =
              '<div class="text-center"><h3 class="text-danger">Upss.<br>Finalizo el tiempo de prueba</h3></div>';
            break;
        }
      },
    });
  } else {
    document.getElementById("mensaje").innerHTML =
      '<div class="text-center"><span class="text-danger">Usuario y contraseña requeridos</span></div>';
  }
}
function validateEmpty() {
  var inputs = document.getElementsByClassName("form-control");
  var i = 0;
  var rpt = true;
  while (i < inputs.length) {
    if (inputs[i].value.trim() == "") {
      inputs[i].style.borderColor = "red";
      rpt = false;
    } else {
      inputs[i].style.borderColor = "#ccc";
    }
    i++;
  }
  return rpt;
}
