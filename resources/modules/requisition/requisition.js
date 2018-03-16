function requisitionOnload() {



    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'apprequisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });
    
    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchTran();
        }
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
    selectAll();

}

function apprequisitioncallback(response) {
    if (response.success) {
        if (response.usage == 'getApprequisition') {
            var arr = response.data;
            var recordArr = [];
            console.log(arr);
            console.log(recordArr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-requisition').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
                        +' <td width="2%"><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].SeqID, true) + '></td>'
                        + '<td data-title= "Name:" class = "td-app">' + formatValue(arr[i].Name, true) + '</td>'
                        + '<td data-title= "Amount:" class = "td-app">' + formatValue(arr[i].Amount, true) + '</td>'
                        + '<td data-title= "Details:" class = "td-app">' + formatValue(arr[i].Details, true) + '</td>'
                        + '<td><a class = "btn-material inverse btn-sm" onclick = "loadForm(\'' + arr[i].SeqID + '\');">&nbsp;<span class = "fa fa-eye"></span></a></td>'

                        + '</tr>'
                        );

                $('#rows1' + i).attr('SeqID', arr[i].SeqID);
                $('#rows1' + i).dblclick(function(a) {
                    var SeqID = $(this).attr('SeqID');
                    if (SeqID) {
                        loadForm(SeqID);
                    }
                });
            }
        } else if (response.usage == 'getExactApprequisition') {
            var arr = response.data[0];
            
            
            $('#TranID').val(formatValue(arr.TranID, true));
            $('#TranDate').val(formatValue(arr.TranDate, true));
            $('#TranType').val(formatValue(arr.TranType, true));
            $('#Name').val(formatValue(arr.Name, true));
            $('#Details').val(formatValue(arr.Details, true));
            
            var $ItemID = $('<option selected>' + formatValue(arr.ItemID, true) + '</option>').val(formatValue(arr.ItemID, true));
            $('#ItemID').append($ItemID).trigger('change');
            
            $('#ItemDesc').val(formatValue(arr.ItemDesc, true));
            $('#UOM').val(formatValue(arr.UOM, true));
            $('#Qty').val(formatValue(arr.Qty, true));
            $('#UnitCost').val(formatCurrencyList(formatValue(arr.UnitCost, true),true));
            $('#Amount').val(formatCurrencyList(formatValue(arr.Amount, true),true));
            $('#RequiredDate').val(formatValue(arr.RequiredDate, true));
            $('#SeqID').val(arr.SeqID);
        }
    }
}


function addRecord() {
    /*Back Module*/
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('requisition');
    $('#ModuleID', window.parent.document).val('requisition');
    $('#ModuleName', window.parent.document).val('Requisition');

    $('#requisition-list').css('display', 'none');
    $('#requisition-form').css('display', 'block');

    $('#Module-Name').empty();
    $('#Module-Name').html('New Requisition');


    //button

    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-add').css('display', 'none');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#AddRow').css('display', 'inline');


    // store
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=REQAPP'
    });

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

    });



//  Default values    
    removeRecord();
    getDate();
    enabledInput();
    setNumberDefault();
    formatCurrency();



}

function idsetupcallback(response) {
    if (response.success) {

        if (response.usage == 'getNextID') {
            var arr = response.data[0];
            $('#TranID').val(arr.NextGenID);
        }
    }
}

function getDate() {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#TranDate').val(today);
    $('#RequiredDate').val(today);
}

function saveRecord() {
    var data = objectifyForm($('#req_form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "apprequisitionservlet?operation=UPDATE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
                back();
            } else {
                $('#message-info').css('display', 'block');
                $('#message-text').html(data.message);
            }
        }});
}

function editRecord() {
    
    $('#btn-edit').css('display', 'none');
    $('#btn-print').css('display', 'none');
    $('#btn-save').css('display', 'block');
    $('#btn-delete').css('display', 'none');
    $('#btn-cancel').css('display', 'block');
    $('#btn-close').css('display', 'none');
    $('#btn-add').css('display', 'none');

    $('input').removeAttr('disabled');
    $('select').removeAttr('disabled');
    $('#AddRow').css('display', 'inline');
    
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&dropdown=true'

    });
    
    

    enabledInput();
    formatCurrency();
    
    


}


function deleteRecord() {
    var data = objectifyForm($('#requisition-form').serializeArray());
    $.ajax({
        type: 'POST',
        url: baseUrl + "apprequisitionservlet?operation=DELETE_RECORD",
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
            } else {
                $('#message-info').css('display', 'block');
                $('#message-text').html(data.message);
            }
        }});
}
function printRecord() {
    var TranID = $('#TranID').val();
    showReportForm(TranID, 'FormName', 'apprequisition');
}
function printAllRecord() {

}

function cancelRecord() {
    $('#MsgAlertCloseForm').modal('show');
    $('#Close-No').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
    });
    $('#Close-Yes').click(function() {
        $('#MsgAlertCloseForm').modal('hide');
        $('#requisition-form').css('display', 'none');
        $('#requisition-list').css('display', 'block');
        back();
        enabledInput();
        $('#message-info').css('display', 'none');
        $('#message-text').empty();
    });
}
function loadForm(refid) {


    
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('requisition');
    $('#ModuleID', window.parent.document).val('requisition');
    $('#ModuleName', window.parent.document).val('Requisition');
    
    
    $('input').attr('readonly', 'readonly');
    $('textarea').attr('readonly', 'readonly');
    $('select').attr('readonly', 'readonly');
    $('#total').attr('disabled', 'disabled');

    $('#Module-Name').replaceWith('<span style ="font-family: calibri;font-weight: bold;font-size: 15pt;" id ="Module-Name"> Edit transaction </span>');

    /*tab-control*/

    /*tab-control*/

    /*btn-control*/
    $('#btn-edit').css('display', 'block');
    $('#btn-print').css('display', 'block');
    $('#btn-delete').css('display', 'block');
    $('#btn-cancel').css('display', 'none');
    $('#btn-add').css('display', 'block');
    $('#btn-save').css('display', 'none');
    $('#btn-close').css('display', 'block');
    /*btn-control*/



    $('#requisition-form').css('display', 'block');
    $('#requisition-list').css('display', 'none');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'apprequisitionlist?jsonformat=jsonp&exactOnly=true&apprequisition=' + refid
    });
    formatCurrency();
}

function closeRecord() {
    enabledInput();
    $('#requisition-form').css('display', 'none');
    $('#requisition-list').css('display', 'block');
}


function itemcallback(response) {
    if (response.success) {
        if (response.usage == 'getDropdownItem') {
            var arr = response.data;
            $('.item-select2').select2({
                width: null,
                prefwidth: 'auto',
                placeholder: {
                    id: '',
                    text: 'Select Item'
                },
                theme: 'classic'
            });
            
            for (var i = 0; i < arr.length; i++) {
                $('.item-select2').append('<option value=' + arr[i].ItemID + '>' + arr[i].ItemID + '</option>');
            }
        }
        else if (response.usage == 'getExact') {
            var arr = response.data[0];
            var rownum = response.rownum;


            $("#ItemDesc").val(arr.ItemDescription);

        }
    }

}

function changeEventListener(){
    
    var itemid = $('#ItemID').val();
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemuomlist?jsonformat=jsonp&exactOnly=true&itemid=' + itemid
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'itemlist?jsonformat=jsonp&exactOnly=true&item=' + itemid

    });
    
}

function itemuomcallback(response) {
    if (response.success) {
        if (response.usage == 'getUOM') {
            var arr = response.data;
            var rownum = response.rownum;
            $('.itemuom-select2').select2({
                width: null,
                prefwidth: 'auto',
                theme: 'classic'
            });

            for (var i = 0; i < arr.length; i++) {
                $(".itemuom-select2").empty();
                $(".itemuom-select2").append($("<option></option>", {
                    value: arr[i].Unit,
                    text: arr[i].UnitDesc
                }));
            }
        }
    }
}

function computeExtCost() {

    var total = 0;
    var qty = $('#Qty').val();
    var unitcost = $('#UnitCost').val();
    var amount = (parseFloat(qty.replace(',', '')) * parseFloat(unitcost.replace(',', '')));
    
    $('#Amount').val(formatCurrencyList(amount, true));

}

function setNumberDefault(){
    $('#Qty').val(1);
    $('#UnitCost').val('0.00');
    $('#Amount').val('0.00');
}


function SearchTran() {
    
    $('#table-requisition').find('tbody').empty();
    
    var value = $('#Search').val();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'apprequisitionlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0&apprequisition=' + value
    });



}

function selectAll() {
    
    $('#select_all').click(function(e) {
        $('.checkbox').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });

    $('#select_all_grid').click(function(e) {
        $('.checkbox_grid').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });
}

var deleteSelectedArr = [];
function multiDelete() {

    
    var data = objectifyForm($('#requisition-form').serializeArray());
    $('.checkbox_list:checked').each(function() {
        deleteSelectedArr.push($(this).val());
    });
    
    
    var records = [];
    var obj = new Object();
    for (var i = 0; i < deleteSelectedArr.length; i++) {
        var rec = deleteSelectedArr[i];
        var obj = new Object();
        obj.SeqID = rec;
        records.push(obj);
    }
    data.data = records;
    
    $.ajax({
        type: 'POST',
        url: baseUrl + "apprequisitionservlet?operation=MULTI_DELETE",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data) {
            if (data.success) {
                $('#MsgAlert').modal('show');
            } else {
                alert('You failed');
            }
        }});
}

function confirmMultiDelete() {
    $('#MsgAlertDelete').modal('show');
    $('#Confirm-No').click(function() {
        $('#MsgAlertDelete').modal('hide');
    });
    $('#Confirm-Yes').click(function() {
        $('#MsgAlertDelete').modal('hide');
        multiDelete();
    });
}

function reloadPage(){
    window.location.reload();
}