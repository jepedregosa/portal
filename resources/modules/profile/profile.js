/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function profileOnload(){
    
    var cookies = document.cookie;
    cookies = cookies.split("; ");
    var obj = new Object();
    for (var i = 0; i < cookies.length; i++){
        var cookies_tmp = cookies[i].split("=");
        eval('obj.' + cookies_tmp[0] + ' = "'+cookies_tmp[1]+'"');
        
    }
    jQuery.ajax({
        type: 'POST',
        jsonpCallback: "callback",
        crossDomain: true,
        dataType: 'jsonp',
        url: baseUrl + 'userslist?jsonformat=jsonp&exactOnly=' + obj.UserID
    });
}



function userscallback(response) {
    if (response.success) {
        if(response.usage == 'getExactUsers'){
           var arr = response.data[0];
           $('#Name').val(arr.FullName);
           $('#Email').val(arr.EmailAddress);
           $('#CompanyName').val(arr.CompanyName);
           $('#Branch').val(arr.BranchDesc);
           $('#CompanyAddress').val(arr.CompanyAddress);
           $('#TINNo').val(arr.TINNo);
           
           
           
        }
    } else {
        window.location = "./main.html";
    }
}

