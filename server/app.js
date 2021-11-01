const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbService = require('./dbService');

app.use(cors()); //not block incoming api call - send data to backend
app.use(express.json()); //send data in json format
app.use(express.urlencoded({ extended : false })); //not send any form data

//Defind - ROUTES  
//- CREATE - POST = create new data
app.post('/insert', (request, response) => {
    console.log("show request=", request.body);
    const { username } = request.body;
    const { password } = request.body;
    const { email } = request.body;
    const { contactnumber } = request.body;

    console.log("apps-post=" + username + " " + password + " " + email + " " + contactnumber);
    const db = dbService.getDbServiceInstance();
    const result =  db.insertNewName(username, password, email, contactnumber);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// READ
// when DOM is loaded make fetch call to backend
app.get('/getAll', (request, response) => {
    //For Testing console BELOW:
    console.log('WebPage reached backend node server for getAll'); //when making api call - reached backend
   
    //Check for class DbService instance
    //gets dbService object 
    const db = dbService.getDbServiceInstance();

    const result =  db.getAllData();

    result
    //data is an object
    //to access the data array we need data key
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

// update
app.patch('/update', (request, response) => {
    console.log("InAPP.show request=", request.body);
    const { username, password, email, contactnumber } = request.body;

    console.log("Name=", username);
    //const { password } = request.body;
    //const { email } = request.body;
    //const { contactnumber } = request.body;
    //console.log("IN app.patch=" + username + "-" + password + "-" + email + "-" + contactnumber );

    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(username, password, email, contactnumber);

    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});
  
// delete
app.delete('/delete/:username', (request, response) => {  
    console.log("IN app.delete");

    const { username } = request.params;
    console.log("Name=", username);

    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById( username );

    result
    .then(data => response.json({success : data}))
    .catch( err => console.log(err));
})

// search
app.get('/search/:name', (request, response) => { 
    const { name } = request.params;

    console.log("Name=" + name); 
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName( name );

    result
    .then(data => response.json({data : data}))
    .catch( err => console.log(err));
})

//start local server - know it is running
app.listen(process.env.PORT, () => console.log('MYAPP is running'));