window.onload = callTable();
function callTable() {
    paintTable('/stock/listStock', ['nombre'], ['nombrestock'], 'iidstock', 'modalStock', true, true);
}
function save() {
    if (validateEmpty()) {
        var frm = new FormData();
        capturarData(frm);
        sendDataController('/stock/saveStock', frm, 'Este stock ya existe');
    } else {
        messeges('warning', 'Complete los campos marcados');
    }
}
function edit(id) {
    getDataById('/stock/getStockById?id=' + id, ['iidstock', 'nombrestock']);
}
function deleteInfo(id) {
    messegeConfirm('/stock/deleteStock?id=' + id);
}