// event handler for when page first loads, invoke calback function
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json()) //convert response into json
    //TEST
    //.then(data => console.log(data)); //show json data on console
    //TEST
    //loadHTMLTable([]);
    .then(data => loadHTMLTable(data['data'])); //load html data into Table
});

function loadHTMLTable(data) {
    console.log(data);
    console.log("in loadHTMLTable()");

    const table = document.querySelector('table tbody'); //grab table body

    if (data.length === 0) {  //data array is empty
        //add table row
        table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>";
        return;
    }
    let tableHtml = "";

    // callback fuction
    //retrieve all items from db 
    data.forEach(function ({username, password, email, contactnumber}) {
        //used when table is first loaded
        tableHtml += "<tr>";
        //use spring intipolation
        tableHtml += `<td>${username}</td>`;
        tableHtml += `<td>${password}}</td>`;
        tableHtml += `<td>${email}</td>`;
        tableHtml += `<td>${contactnumber}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-username=${username}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-username=${username}>Edit</td>`;
        tableHtml += "</td>";        
    });
    table.innerHTML = tableHtml;
} 

document.querySelector('table tbody').addEventListener('click', function(event) {
    console.log("In function(event)" + event.target.dataset.username);

    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.username);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.username);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    console.log("In searchBtn.onclick()");

    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

function deleteRowById(username) {
    const deleteValue = document.querySelector('#name-input').value;
    console.log("index.deleteValue====" , deleteValue);
    console.log("In index.deleteRowBYId()=====" + username);

    fetch('http://localhost:5000/delete/' + username, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow( username ) {
    console.log("In handleEditRow()" + username);

    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.username = username;
} 

updateBtn.onclick = function() {   
    //const updateNameInput = document.querySelector('#update-row-btn').dataset.username;
    //const name = updateNameInput.value;
    //updateNameInput.value = "";

    const passwordInput = document.querySelector('#update-password-input');
    const password = passwordInput.value;
    //passwordInput.value = "";

    const emailInput = document.querySelector('#update-email-input');
    const email = emailInput.value;
    //emailInput.value = "";

    const contactnumberInput = document.querySelector('#update-contactnumber-input');
    const contactnumber = contactnumberInput.value;
    //contactnumberInput.value = "";

    console.log("In index.updateBtn.onclick()-" + password + "-" + email + "-" + contactnumber);
     
    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        //body: JSON.stringify({username: name, password: password, email: email, contactnumber: contactnumber})
        body: JSON.stringify({
           username: document.querySelector('#update-row-btn').dataset.username,
            password: password,
            email: email,
            contactnumber: contactnumber
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

const addBtn = document.querySelector('#add-name-btn');
// call back function
addBtn.onclick = function() {
    console.log("In index.addBtn.onclick()");

    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    const passwordInput = document.querySelector('#password-input');
    const password = passwordInput.value;
    passwordInput.value = "";

    const emailInput = document.querySelector('#email-input');
    const email = emailInput.value;
    emailInput.value = "";

    const contactnumberInput = document.querySelector('#contactnumber-input');
    const contactnumber = contactnumberInput.value;
    contactnumberInput.value = "";
  
    //send to backend
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({username : name, password: password, email: email, contactnumber: contactnumber})     
    }) 
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
    console.log("In - insertRowIntoTable()")

    const table = document.querySelector('table tbody');
    //does class noData exist
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
         
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                 data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn"   data-id=${data.id}>Edit</td>`;      

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else  {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }     
}

