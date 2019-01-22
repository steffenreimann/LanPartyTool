var conlist = [];
var ix = 0;
var data1 = "";
var chatme = "";

jsondata = { ul: '<ul class="list-group pmd-z-depth pmd-list pmd-card-list">',
            li: '<li class="list-group-item"><h3 class="list-group-item-heading">',
            span: '</h3><span class="list-group-item-text">',
            send: '</span></li>',
            uend: '</ul>'
            }

console.log(jsondata.ul);

$("#chat").keypress(function(e) {
    if(e.which == 13) {
        chat($("#chat").val())
        //list($("#chat").val())
    }
});

function chat(data) {
    
    
}

function list(data, name, ip){
    ix++
    chatme += jsondata.ul;
    chatme += jsondata.li;
    chatme += data;
    chatme += jsondata.span;
    chatme += name + " " + ip;
    chatme += jsondata.send;
    chatme += jsondata.ul;
    
    conlist.push(chatme);
    $('#chatw').html(conlist);
    chatme = "";
    scrolldown();
}

function scrolldown() {
    checkbox = $('form input[type=checkbox]:checked').val();
    if (checkbox == "on") {
        var elem = document.getElementById('chatw');
        elem.scrollTop = elem.scrollHeight;
    }
}

list("Halllo Halllo erster test", "Steffen", "192.168.0.22")


//'<ul class="list-group pmd-z-depth pmd-list pmd-card-list">'
//    '<li class="list-group-item">
//        <h3 class="list-group-item-heading">'Two-line item'</h3>
//        <span class="list-group-item-text">'Secondary text'</span>
//    </li>'
//    <li class="list-group-item">
//        <h3 class="list-group-item-heading">Two-line item</h3>
//        <span class="list-group-item-text">Secondary text</span>
//    </li>
//    <li class="list-group-item">
//        <h3 class="list-group-item-heading">Two-line item</h3>
//        <span class="list-group-item-text">Secondary text</span>
//    </li>
//'</ul>'
