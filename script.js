
function data(url)
{
    fetch(url)
    .then(response => response.json())
    .then(data => {tableCreate(data); tablaCorr(data);});
}


function tableCreate(data)
{
    var body = document.body,
    tit = document.createElement('H1')
    tit.innerText = 'Events'
    tbl  = document.createElement('table');
    tbl.classList.add('table');
    
    thead = document.createElement('thead')
    tr = document.createElement("tr")
    th = document.createElement("th")
    tr.appendChild(th).innerText = "#"
    th = document.createElement("th")
    tr.appendChild(th).innerText = "Events"
    th = document.createElement("th")
    tr.appendChild(th).innerText = "Squirrel"

    thead.appendChild(tr)
    tbl.appendChild(thead)

    tbod = document.createElement('tbody')
    for(var i = 0; i < data.length; i++)
    {
        var tr = tbod.insertRow();
        
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(i+1));
        
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(data[i]["events"]));
        
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(data[i]["squirrel"]));
        
        if( data[i]["squirrel"] )
        {
            tr.style.backgroundColor = 'pink'
        }
    }
    tbl.appendChild(tbod)
    body.appendChild(tit)
    body.appendChild(tbl);
}


function corr(event, json)
{
    var arr = [0, 0, 0, 0];
    for (var i = 0; i < json.length; i++) 
    {
        var act = json[i], index = 0;
        if (act.events.indexOf(event) != -1 ) index += 1;
        if (act.squirrel) index += 2;
        arr[index] += 1;
    }
    tn = arr[0]
    fn = arr[1]
    fp = arr[2]
    tp = arr[3]

    mcc = ( ((tp*tn)-(fp*fn)) / Math.sqrt( (tp+fp)*(tp+fn)*(tn+fp)*(tn+fn) ) )
    return mcc
}

function tablaCorr(data)
{
    var contados = {};
    var valores = [];

    for ( var i = 0; i < data.length ; i++) 
    {
        item = data[i]
        var events = item.events
        for(var j = 0 ; j < Object.keys(data[i]).length ; j++)
        {
            if (!(events[j] in contados)) 
            {
                contados[events[j]] = 1
                valores.push({event:events[j], val: corr(events[j], data)}) 
            }
        }
    }
    
    valores = valores.sort(function(a,b){return b.val - a.val;})
    
    var body = document.body,
    tit = document.createElement('H1')
    tit.innerText = 'Events correlation'
    tbl  = document.createElement('table');
    tbl.classList.add('table');

    thead = document.createElement('thead')
    tr = document.createElement("tr")
    th = document.createElement("th")
    tr.appendChild(th).innerText = "#"
    th = document.createElement("th")
    tr.appendChild(th).innerText = "Event"
    th = document.createElement("th")
    tr.appendChild(th).innerText = "Correlation"

    thead.appendChild(tr)
    tbl.appendChild(thead)

    tbod = document.createElement('tbody')

    for( var i = 0 ; i < valores.length ; i++)
    {
        var tr = tbod.insertRow();
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(i+1));
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(valores[i].event));
        var td = tr.insertCell();
        td.appendChild(document.createTextNode(valores[i].val)); 
    }

    tbl.appendChild(tbod)
    body.appendChild(tit)
    body.appendChild(tbl);
}

data ("https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json")