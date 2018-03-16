function paymentrequestOnload(){
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'apppaymentrequestlist?jsonformat=jsonp&dolimit=true&limitcount=100&limitindex=0'
    });
    
    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            SearchTran();
        }
    });
    
    $("#includePrompts").load("../../lookup/lookup.html");
    
    
    selectAll();
    
    


}

function apppaymentrequestcallback(response) {
    if (response.success) {
        if (response.usage == 'getApppaymentrequest') {
            var arr = response.data;
            var recordArr = [];
            console.log(arr);
            console.log(recordArr);
            for (var i = 0; i < arr.length; i++) {
                $('#table-paymentrequest').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
                        +' <td width="2%"><input class = "checkbox_list" type = "checkbox" style = "width:15px;height:15px;margin-left:3px !important" value= ' + formatValue(arr[i].SeqID, true) + '></td>'
                        + '<td data-title= "Name:" class = "td-app">' + formatValue(arr[i].Name, true) + '</td>'
                        + '<td data-title= "Amount:" class = "td-app">' + formatValue(arr[i].Amount, true) + '</td>'
                        + '<td data-title= "Details:" class = "td-app">' + formatValue(arr[i].Memo, true) + '</td>'
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
        } else if (response.usage == 'getExactapppaymentrequest') {
            var arr = response.data[0];
            $('#TranID').val(arr.TranID);
            $('#TranDate').val(arr.TranDate);
            $('#TranType').val(arr.TranType);
            $('#Name').val(arr.Name);
            $('#Memo').val(arr.Memo);
            
            
            $('#Account').val(arr.Account);
            $('#SubAcct').val(arr.SubAcct);
            $('#Terms').val(arr.Terms);
            $('#Amount').val(arr.Amount);
            $('#SeqID').val(arr.SeqID);
        }
    }
}


function addRecord() {
    /*Back Module*/
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('paymentrequest');
    $('#ModuleID', window.parent.document).val('paymentrequest');
    $('#ModuleName', window.parent.document).val('Request for Payment');
    

    $('#paymentrequest-list').css('display', 'none');
    $('#paymentrequest-form').css('display', 'block');

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
        url: baseUrl + 'idsetuplist?jsonformat=jsonp&module=RFPAPP'
    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'accountlist?jsonformat=jsonp&jsonformat=jsonp&dolimit=true&limitcount=1000&limitindex=0'

    });
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'paymenttermslist?jsonformat=jsonp&jsonformat=jsonp&dolimit=true&limitcount=1000&limitindex=0'

    });
    
    
    


//  Default values    
    removeRecord();
    getDate();
    enabledInput();
    formatCurrency();

}

var SubAcct;
function accountcallback(response){
    if (response.success) {
        if (response.usage == 'getAccount') {
            var arr = response.data;
            
            
            $('.account-select2').select2({
                width: null,
                prefwidth: 'auto',
                placeholder: {
                    id: '',
                    text: 'Select Account'
                },
                theme: 'classic'
            });
            
            for (var i = 0; i < arr.length; i++) {
                $('.account-select2').append('<option subaccount =  '+arr[i].SubAcctGroup+' value=' + arr[i].Account + ' accountdesc = '+arr[i].AccountDesc+'>' + arr[i].Account + '</option>');
            }
            
            
            
        }
    }
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
}

function loadForm(refid) {


    
    $('.sidebarCollapse-media-mobile', window.parent.document).css('display', 'none');
    $('.sidebar-mobile', window.parent.document).css('display', 'block');
    $('#ModuleGroup', window.parent.document).val('paymentrequest');
    $('#ModuleID', window.parent.document).val('paymentrequest');
    $('#ModuleName', window.parent.document).val('Request for Payment');
    
    
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



    $('#paymentrequest-form').css('display', 'block');
    $('#paymentrequest-list').css('display', 'none');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'apppaymentrequestlist?jsonformat=jsonp&exactOnly=true&apppaymentrequest=' + refid
    });
    formatCurrency();
}


function changeEventListener(){
    
    var Account = $('#Account').val();
    
    
    
    
    $('#Account > option').each(function(){
        if($(this).val() == Account){
            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'subaccountlist?jsonformat=jsonp&bySubAccount=true&subgroup=' + $(this).attr('subaccount')
            });
            $("#AccountDesc").val($(this).attr('accountdesc'));
        }
    });
    
    
    
    
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'accountlist?jsonformat=jsonp&exactOnly=true&account=' + Account
    });
    
    
}

function subaccountcallback(response){
    if(response.success){
        if(response.usage == 'getSubaccount'){
            
            var arr = response.data;
//            $('.subaccount-select2').removeAll();
//            $('#SubAccount-div').append('<select class ="form-control subaccount-select2 input-sm" name="SubAcct" id ="SubAcct" onchange="changeEventListener();"></select>');
            
            for (var i = 0; i < arr.length; i++) {
                var subacctArr = [];
                var obj = new Object();
                obj.id = arr[i].SubAcct;
                obj.text = arr[i].SubAcct;
                subacctArr.push(obj);
                $('.subaccount-select2').select2({
                    width: null,
                    data: subacctArr,
                    prefwidth: 'auto',
                    placeholder: {
                        id: '',
                        text: 'Select SubAccount'
                    },
                    theme: 'classic'
                });
            }
        }
    }
}

function paymenttermscallback(response){
    if(response.success){
        if(response.usage=='getPayterms'){
            var arr = response.data;
            $('.terms-select2').select2({
                    width: null,
                    prefwidth: 'auto',
                    placeholder: {
                        id: '',
                        text: 'Select Terms'
                    },
                    theme: 'classic'
                });
//            $('.terms-select2').empty();
            for (var i = 0; i < arr.length; i++) {
                $('.terms-select2').append('<option  value=' + arr[i].TermsID + '>' + arr[i].TermsDesc + '</option>');
            }
        }
    }
}



function saveRecord() {
    var data = objectifyForm($('#rfp_form').serializeArray());
    console.log(data);
    $.ajax({
        type: 'POST',
        url: baseUrl + "apppaymentrequestservlet?operation=UPDATE_RECORD",
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
    var data = objectifyForm($('#rfp_form').serializeArray());
    $.ajax({
        type: 'POST',
        url: baseUrl + "apppaymentrequestservlet?operation=DELETE_RECORD",
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
        $('#paymentrequest-form').css('display', 'none');
        $('#paymentrequest-list').css('display', 'block');
        back();
        enabledInput();
        $('#message-info').css('display', 'none');
        $('#message-text').empty();
    });
}

function closeRecord() {
    enabledInput();
    $('#paymentrequest-form').css('display', 'none');
    $('#paymentrequest-list').css('display', 'block');
}