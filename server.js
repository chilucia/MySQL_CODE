// import mysql
const mysql = require ('mysql');

// import express library
const express = require ('express');
const e = require('express');

// create an application instance
const app = express();

// call a middleware
app.use(express.json())

// create a connection config
let mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'luciaDB',
    multipleStatements: true,
})

// connect to the database
mysqlConnection.connect( () => {
    console.log('Database connection successful')
});

// test for endpoint
app.get("/", (req,res) => {
res.send ("Welcome to our new express api")
});

// get all students
app.get("/students", (req,res,) => {
    mysqlConnection.query('SELECT * FROM luciaInfo', (err, rows, fields) => {
        if (err) {
            console.log(err.message)
        }else{
            res.status(200).json({
                data:rows
            })
            //  res.send(
            //     rows
            //  )
    
        }
      })
});

app.get("/students/:id", (req,res) => {
    mysqlConnection.query("SELECT * FROM luciaInfo WHERE id=?", [ req.params.id ], (error, rows, fields) => {
        if(!error){
            res.status(200).json({
                message: "student was succesfully retrieved",
                data: rows
            });
        }else{
            console.log(error.message);
            res.status(404).json({
                message: error.message
            });
        }
    })
});

// approach two
// app.get('/students/:id', async (req,res) => {
//     try{
//         await mysqlConnection.query( 'SELECT * FROM studentBio WHERE id=?', [req.params.id], (error,rows,fields) => {
//             if(!error){
//                 res.status(200).json({
//                     message: 'student was successfully retrieved',
//                     data: rows
//                 })
//             }else{
//                 console.log(error.message)
//                 res.status(404).json({
//                     message: error.message
//                 })
//             }
//         });
//     }catch(error){
//         res.status( 404 ).json({
//             message: error.message
//         })
//     }
// });


// app.get('/students/:id', async (req,res) => {
//     try{
//         let id =req.params.id
//         await mysqlConnection.query( `SELECT * FROM studentBio WHERE id=${id}`,(error,rows,fields) => {
//             if(!error){
//                 res.status(200).json({
//                     message: 'student was successfully retrieved',
//                     data: rows
//                 })
//             }else{
//                 console.log(error.message)
//                 res.status(404).json({
//                     message: error.message
//                 })
//             }
//         });
//     }catch(error){
//         res.status( 404 ).json({
//             message: error.message
//         })
//     }
// });


// remove a record from a database table
app.delete('/students/:id',(req,res) => {
    let id = req.params.id;
    mysqlConnection.query(`DELETE FROM luciaInfo WHERE id=${id}`, (error, rows, fields) => {
        if(!error){
            res.status(200).json({
                message: "student is deleted successfully"
            })
        }else{
            res.status(404).json({
                message: error.message

            })
        }
    });
});

// add a new record to the database table
app.post("/students", (req,res) => {
    let student = req.body;
    let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
    CALL curveAddOrEdit(@id, @name, @course, @duration, @age);`;

    mysqlConnection.query(sql, [ student.id, student.name, student.course, student.duration, student.age],(error,rows,fields) => {
        if (!error){
            rows.forEach( (element) => {
                if(element.constructor == Array){
                    res.status(200).json({
                        message: "New student created.",
                        data: "student ID: " + element[ 0 ].id
                    })
                }else{
                    console.log("No student found")
                }
            });
        }else{
            console.log(error.message);
        }
    });
});

// create a port
const PORT = 3000;
app.listen(PORT, () => {
    console.log("listening on port:" + PORT)
});