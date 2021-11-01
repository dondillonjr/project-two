const mysql  = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
        //host: "ec2-18-216-119-62.us-east-2.compute.amazonaws.com",
        //user: "root",
        //password: "myPassword",
        //database: "web_app",
        //port: 3306
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT
});

//takes a call back
connection.connect( (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('DB ' + connection.state);
})

// This class contains all functions to that will allow you to
// getData, uploadData, deleteData
class DbService {
    static getDbServiceInstance() {
        //create only one instance of DBService
        return instance ? instance : new DbService();
    }

    // gets data
    async getAllData() {
        try {   //Promise will handel query
                //if query sucessfull - resolve it
                //if query failed reject it
                const response = await new Promise(( resolve, reject) => {
                    const query = "SELECT * FROM legal_users;";

                    connection.query(query, (err, results ) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                });
                //show response on Terminal console
                console.log("In dbService.getAllData()")
                console.log(response);
                console.log("finished getAll")

                return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(username, password, email, contactnumber) {
        try {       
            const dateAdded = new Date();
            const insertId = await new Promise(( resolve, reject) => {
                const query = "INSERT INTO legal_users (username, password, email, contactnumber) VALUES (?,?,?,?);";

                connection.query(query, [username, password, email, contactnumber], (err, result ) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            console.log("In dbService.insertNewName()=", username + " " + password + " " + email + " " + contactnumber + " " + insertId + " " + username);

            //show response on Terminal console
            return {
                id : insertId,
                username : username,
                password : password,
                email: email,
                contactnumber: contactnumber
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(name) {
        try {       
            console.log("In dbService.deleteRowById() = " + name);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM legal_users WHERE username = ?";
                console.log(query);
                connection.query(query, [name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            console.log("dbService.deleteRowById.responsers=" ,response);
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }       
    }

    async updateNameById(username, password, email, contactnumber) {
        try {
            console.log("In dbService.updateNameById()- " + username + "-" + password + "-" + email + "-" + contactnumber);
            //id = parseInt( id, 10);
            const response =  await new Promise((resolve, reject) => {
                //const query = "UPDATE legal_users SET username = ? WHERE id = ?";

                //connection.query(query, [username , id] , (err, result) => {
                   
                
                const query = "UPDATE legal_users SET password = ?, email = ?, contactnumber = ? WHERE username = ?;";

                console.log("QUERY=", query);
                connection.query(query, [password, email, contactnumber, username], (err, result ) => {
                   
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(username) {
        try {   
            console.log("In searchByName() - " + username);

            const response = await new Promise(( resolve, reject) => {
                const query = "SELECT * FROM legal_users WHERE username = ?;";

                connection.query(query, [ username ], (err, results ) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            //show response on Terminal console
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

//export this DbService Class
module.exports = DbService;