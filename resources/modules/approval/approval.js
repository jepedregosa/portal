/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var baseUrl = "http://localhost:8080/portal/";

function approvalOnload() {

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&ModuleType=true&action=onload'
    });

    selectAll();

    $('#Search').keyup(function(event) {
        if (event.keyCode === 13) {
            searchRec();
        }
    });
    



    $("#includePrompts").load("../../lookup/lookup.html");


}

function closeMsgboxApproval(OnClose) {

    $('#messageLookup').modal('hide');
    $('#addRemarks').val('');
    $('input:checkbox').removeAttr('checked');
    $('input:checkbox').removeProp('checked');
    if (!OnClose) {
        $('#MsgAlertApproval').modal('hide');
        var curtrantype = $('#module-trantype').val();
        if (curtrantype.trim() == '') {
            $('#approvalLookup').modal('show');
        } else {
            $('#approvalLookup').modal('hide');

            jQuery.ajax({
                type: 'POST',
                jsonpCallback: "callback",
                crossDomain: true,
                dataType: 'jsonp',
                url: baseUrl + 'forapprovallist?jsonformat=jsonp&trantype=' + curtrantype
            });
        }
    }
    else {
        $('#MsgAlertApproval').modal('hide');
        jQuery.ajax({
            type: 'POST',
            jsonpCallback: "callback",
            crossDomain: true,
            dataType: 'jsonp',
            url: baseUrl + 'forapprovallist?jsonformat=jsonp&ModuleType=true'
        });
    }

}




function reloadModule() {

}


function loadForApproval(TranType) {
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&trantype=' + TranType
    });
}

function reloadRecords() {
    $('#approvalLookup').modal('show');
}
var recordsArr = [];
function approveTransaction() {


    var list = ['BatNbr', 'TranType', 'TranID', 'TranDate', 'Action', 'VendorName', 'Memo', 'DocAmount', 'DocOwner', 'SeqID', 'Module'];
    
    
     var arr = [];
    $.each($('input[name="Action[]"]:checked').closest('tr'),
            function() {
                var obj = new Object();
                for (var i = 0; i < $(this).find('td').length; i++) {
                    var arrVal = $(($(this).find('td'))[i]).text();
                    arrVal = arrVal.replace(/(\r\n|\n|\r)/gm,"");
                    eval('obj.' + list[i] + ' = "'+arrVal+'"');
                    obj.Action = 'APPROVE';
                }
                arr.push(obj);
                
            }
    );
    

    var data = objectifyForm($('#table-approval').serializeArray());
    //empty first arr
    data.details = arr;

    $.ajax({
        type: 'POST',
        url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data) {
            if (data.success) {
                $('#MsgAlertApproval').modal('show');
            } else {
                alert('You failed');
            }
        }});
    


}


function rejectTransaction() {


    var list = ['BatNbr', 'TranType', 'TranID', 'TranDate', 'Action', 'VendorName', 'Memo', 'DocAmount', 'DocOwner', 'SeqID', 'Module'];

    var arr = [];

    $.each($('input[name="Action[]"]:checked').closest('tr'),
            function() {
                var obj = new Object();


                for (var i = 0; i < $(this).find('td').length; i++) {
                    eval('obj.' + list[i] + ' = \'' + $(($(this).find('td'))[i]).text() + '\'');
                    obj.Action = 'REJECT';
                }

                arr.push(obj);

                console.log(arr);
            }
    );

    var data = objectifyForm($('#table-approval').serializeArray());
    //empty first arr
    data.details = arr;

    $.ajax({
        type: 'POST',
        url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(data) {
            if (data.success) {
                $('#MsgAlertApproval').modal('show');
            } else {
                alert('You failed');
            }
        }});


}

function closeapprovalLookup(empty) {
    $('#approvalLookup').modal('hide');
    $('.highlight').removeClass('highlight');
    $('#trantype').empty();
    $('#trandescription').empty();
    if (empty) {
        $('.tab_approvetran_module-mobile').css('display', 'none');
    } else {
        $('.tab_approvetran_module-mobile').css('display', 'block');
    }


}

function SelectLookup(TranType, TranDescription, onTab) {
    
    
    if (onTab) {
        $('.module-tab').removeClass('active');
        $('.tabactive' + TranType).addClass('active');
        loadForApproval(TranType);
        $('#Module-Name').empty();
        $('#Module-Name').html(TranDescription);
        $('#trantype').val(TranType);
        $('#trandescription').val(TranDescription);
    }

    if ($('#trantype').val().trim() == '') {

    } else {
        var trantype = $('#trantype').val();
        var trandescription = $('#trandescription').val();
        console.log(trandescription);

        $('.tab_approvetran_module-mobile').css('display', 'block');
        $('#module-trantype').val(trantype);
        

        $('#Module-Name').empty();
        $('#Module-Name').html(trandescription);
        $('.module-tab').removeClass('active');
        $('.tabactive' + trantype).addClass('active');
        loadForApproval(trantype);
        $('#approvalLookup').modal('hide');
        $('.highlight').removeClass('highlight');
        $('#trantype').empty();
        $('#trandescription').empty();
    }

}
function selectAll() {
    $('.select_all').click(function(e) {
        $('.checkbox_approve').not(this).prop('checked', this.checked);
        var table = $(e.target).closest('table');
        $('td input:checkbox', table).prop('checked', this.checked);
    });
}

function addComment(tr) {

    var data = objectifyForm($('#table-approval').serializeArray());
    var newArr = [];
    var values = new Array();
    $.each($(tr).closest('td').siblings('td'),
            function() {
                values.push($(this).text());
            });

    var obj = new Object();
    obj.BatNbr = values[0];
    obj.TranType = values[1];
    obj.TranID = values[2];
    obj.TranDate = values[3];
    obj.VendorName = values[5];
    obj.DocAmount = values[7];
    obj.DocOwner = values[8];
    obj.SeqID = values[9];
    obj.Module = values[10];
    newArr.push(obj);
    $('#messageLookup').modal('show');
    $('#Name').html("<b> - " + values[5] + " - </b>");
    $('#approvePerTran').on('click', function() {
        newArr[0].Action = 'APPROVE';
        newArr[0].Message = $('#addRemarks').val();
        data.details = newArr;
        $.ajax({
            type: 'POST',
            url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data) {
                if (data.success) {
                    $('#MsgAlertApproval').modal('show');
                } else {
                    alert('You failed');
                }
            }});
    });
    $('#rejectPerTran').on('click', function() {
        newArr[0].Action = 'CANCELLED';
        newArr[0].Message = $('#addRemarks').val();
        data.details = newArr;
        $.ajax({
            type: 'POST',
            url: baseUrl + "forapprovalservlet?operation=PROCESS_RECORD",
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data) {
                if (data.success) {
                    $('#MsgAlertApproval').modal('show');
                } else {
                    alert('You failed');
                }
            }});

    });
}

function closemessageLookup() {
    $('#messageLookup').modal('hide');

}

function searchRec() {
    var module_trantype = $('#module-trantype').val();
    var search = $('#Search').val();

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&action=search&trantype=' + module_trantype + '&value_search=' + search
    });
}



//callback----------------------------


function reloadCurrentRecords() {
    var curtrantype = $('#module-trantype').val();
    $('#approvalLookup').modal('hide');

    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'forapprovallist?jsonformat=jsonp&trantype=' + curtrantype
    });
}

function forapprovalcallback(response) {
    if (response.usage == 'getModuleType') {
        var arr = response.data;
        var action = response.action;
        console.log(arr);
        console.log(arr.length);


        if (arr == 0) {
            $('#lookup-header').empty();
            $('#lookup-header').html('Message');
            $('#approvalLookup').modal('show');
            $('.tab_approvetran_module-mobile').css('display', 'none');
            $('#lookup-message').empty();
            $('#lookup-message').html('No transaction to approve..');
            $('#SelectLookup').css('display', 'none');
            $('#closeapprovalLookup').css('display', 'none');
            $('#closeapprovalLookupEmpty').css('display', 'block');
        }
        else if (arr.length == 1) {
            $('#process-refresh-btn').css('display', 'none');
            for (var i = 0; i < arr.length; i++) {
                console.log(arr[i].TranDescription);
                $('#Module-Name').html(arr[i].TranDescription);
                loadForApproval(arr[i].TranType);
            }
        }
        else if (arr.length >= 2) {



            $('#lookup-header').empty();
            $('#lookup-header').html('Select Module');
            $('#approval-lookup-table').find('tbody').empty();
            if (action == 'onload') {
                $('#approvalLookup').modal('show');
            } else {
                $('#Module-Name').empty();
                reloadCurrentRecords();
            }

            $('#closeapprovalLookupEmpty').css('display', 'none');
            $('#SelectLookup').css('display', 'block');
            $('#lookup-message').empty();
            $('#lookup-message').html('Here are the modules that requires your approval. Please select a record to proceed.');

            for (var i = 0; i < arr.length; i++) {
                $('#approval-lookup-table').append('<tr id="rows' + (i) + '"><td>' + arr[i].TranDescription + '</td></tr>');

                $('#rows' + i).attr('TranType', arr[i].TranType);
                $('#rows' + i).attr('TranDescription', arr[i].TranDescription);
                $('#rows' + i).dblclick(function(a) {
                    var TranType = $(this).attr('TranType');
                    var TranDescription = $(this).attr('TranDescription');
                    if (TranType && TranDescription) {
                        loadForApproval(TranType);
                        $('#Module-Name').empty();
                        $('#Module-Name').html(TranDescription);
                        $('#module-trantype').val(TranType);
                        $('#approvalLookup').modal('hide');

                    }
                });

                $('#rows' + i).click(function(a) {
                    var TranType = $(this).attr('TranType');
                    var TranDescription = $(this).attr('TranDescription');
                    if (TranType && TranDescription) {
                        $('#trantype').val(TranType);
                        $('#trandescription').val(TranDescription);
                    }
                });


//                $('.approvetran_module').append('<li role ="presentation" class = "module-tab tabactive' + arr[i].TranType + '" id = "tabsmodule" ><a class ="noWrapText" aria-label ="home" role ="tab" data-toggle ="tab" onclick = "SelectLookup(\'' + arr[i].TranType + '\',\'' + arr[i].TranDescription + '\', true);">' + arr[i].TranDescription + '</a></li>');


            }

            $('#approval-lookup-table tr').click(function() {
                var selected = $(this).hasClass('highlight');
                $('#approval-lookup-table tr').removeClass('highlight');
                if (!selected)
                    $(this).addClass('highlight');
            });

        }



    }
    else if (response.usage == 'getRecords') {
        var arr = response.data;
        var action = response.action;
        console.log(action);
        var trantype = $('#module-trantype').val();
        console.log(arr);
        $('#forapproval-records').find('tbody').empty();

        if (arr == 0) {
            if (action == 'search') {
                $('#forapproval-records').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;"><td colspan= "6">No Records found..</td>');
            } else {
                $('#approvalLookup').modal('show');
            }


        } else {
            for (var i = 0; i < arr.length; i++) {
                $('#forapproval-records').append('<tr class = "responsive-tr" id="rows1' + (i) + '" rownum = ' + (i) + ' style = "color:#000;cursor:pointer;">'
                        + '<td style = "display:none">' + formatValue(arr[i].BatNbr, true) + '</td>'
                        + '<td style = "display:none">' + formatValue(arr[i].TranType, true) + '</td>'
                        + '<td style = "display:none">' + formatValue(arr[i].TranID, true) + '</td>'
                        + '<td style = "display:none">' + formatValue(arr[i].TranDate, true) + '</td>'
                        + '<td  style ="text-align: center;width:2%"><input class = "checkbox_approve" name = "Action[]" type = "checkbox" style = "width:15px;height:15px" value = "APPROVE"></td>'
                        + '<td class = "td-name">' + formatValue(arr[i].VendorName, true) + '</td>'
                        + '<td  style = "width:30%">' + formatValue(arr[i].Memo, true) + '</td>'
                        + '<td ><b>PHP ' + formatCurrencyList(formatValue(arr[i].DocAmount, true), true) + '</b></td>'
                        + '<td style = "display:none">' + formatValue(arr[i].DocOwner, true) + '</td>'
                        + '<td style = "display:none">' + formatValue(arr[i].SeqID, true) + '</td>'
                        + '<td style = "display:none">' + formatValue(arr[i].Module, true) + '</td>'
                        + '<td style = "display:none"><center><input class = "checkbox_approve" name = "Action[]" type = "checkbox" style = "width:15px;height:15px" value = "APPROVED"></center></td>'
                        + '<td style = "display:none"><center><input class = "checkbox_reject" name = "Action[]" type = "checkbox" style = "width:15px;height:15px" value = "REJECT"></center></td>'
                        + '<td style = "display:none"><a class = "btn btn-primary helix-btn btn-sm"><span class = "fa fa-eye-slash"></span></a></td>'
                        + '<td ><a class = "btn btn-primary helix-btn btn-sm" onclick = "addComment(this);" style = "border-radius:3px"><span class = "fa fa-comments"></span></a></td>'
                        + '</tr>'

                        );

                $('#rows1' + i).attr('TranID', arr[i].TranID);
                $('#rows1' + i).dblclick(function(a) {
                    var TranID = $(this).attr('TranID');
                    if (TranID) {
//                    loadForm(BatNbr);
                    }
                });
            }
            
            enabledButton();
        }





    }
}


function approveRecordConfirm() {
    $('#msg').empty();
    $('#msg').html('Are you sure you want to continue?');
    $('#MsgAlertConfirmScreen').modal('show');
    $('#No').click(function() {
        $('#MsgAlertConfirmScreen').modal('hide');
    });
    $('#Yes').click(function() {
        $('#MsgAlertConfirmScreen').modal('hide');
        approveTransaction();
    });
}
function cancelRecordConfirm() {
    $('#msg').empty();
    $('#msg').html('Are you sure you want to reject this transaction?');
    $('#MsgAlertConfirmScreen').modal('show');
    $('#No').click(function() {
        $('#MsgAlertConfirmScreen').modal('hide');
    });
    $('#Yes').click(function() {
        $('#MsgAlertConfirmScreen').modal('hide');
        rejectTransaction();
    });
}

function enabledButton(){
    var checkboxes_approve = $('.checkbox_approve'),
        btn_approve = $('#process-approve-btn');
        checkboxes_approve.click(function (){
            btn_approve.attr('disabled', !checkboxes_approve.is(':checked'));
    });
}