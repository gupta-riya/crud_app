
document.addEventListener('DOMContentLoaded',function(){
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data =>  loadHTMLTable(data['data']));
    
    
});

document.querySelector("table tbody").addEventListener('click',function(event){
    
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn"){
        editRowById(event.target.dataset.id);
    }
});


const updateBtn = document.querySelector("#update-row-btn");
const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = function(){
    const searchValue = document.querySelector('#search-input').value;
    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data =>  loadHTMLTable(data['data']));

}

function deleteRowById(id){
    fetch('http://localhost:5000/delete/'+id,{
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    })
}



function editRowById(id)
{
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-name-input").dataset.id = id;
    
}

updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input');
    // console.log(updateNameInput.value);
    
    fetch('http://localhost:5000/update',{
    method: 'PATCH',
    headers:{
        'Content-type': 'application/json'
    },
    body: JSON.stringify({
        id: updateNameInput.dataset.id,
        name: updateNameInput.value
    })
})
.then(response => response.json())
.then(data => {
    if(data.success){
        location.reload();
    }
})
}

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function(){
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert',{
        headers:{
            'Content-type': 'application/json'
        },
        method:'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data){
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for(var key in data)
        {
            if(data.hasOwnProperty(key))
            {
                if(key === 'DateAdded')
                {
                    data[key] = new Date(data[key]).toLocaleString();
                }
                tableHtml += `<td>${data[key]}</td>`;
            }
        }

        tableHtml += `<td><button class = "delete-row-btn" data-id=${data.Id}>Delete</button></td>`;
        tableHtml += `<td><button class = "edit-row-btn" data-id=${data.Id}>Edit</button></td>`;

    tableHtml += "</tr>";

    if (isTableData){
        table.innerHTML = tableHtml;
    }
    else
    {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data)
{
    const table=  document.querySelector('table tbody');

    if(data.length === 0)
    {
        table.innerHTML = "<tr><td class = 'no-data' colspan = '5'>No Data</td></tr>";
    }
    else
    {
        let tableHtml = "";
        data.forEach(function({Id,Name,DateAdded}){
            tableHtml += "<tr>";
            tableHtml += `<td>${Id}</td>`;
            tableHtml += `<td>${Name}</td>`;
            tableHtml += `<td>${new Date(DateAdded).toLocaleString()}</td>`;
            tableHtml += `<td><button class = "delete-row-btn" data-id=${Id}>Delete</button></td>`;
            tableHtml += `<td><button class = "edit-row-btn" data-id=${Id}>Edit</button></td>`;
            tableHtml += "</tr>";
        });

        table.innerHTML = tableHtml;
    }
}

