const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
// const knex = require('knex');
const { Connection } = require('pg');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smart-brain'
});

db.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
})

const app = express();

app.use(cors())
app.use(express.json()); 

app.get('/users', (req, res)=> {
  res.send(smart-brain.users);
})

app.post('/signin', (req, res) => {

   let sql = `select * from users where email = '${req.body.email}'`;
   db.query(sql, (error, results, fields) => {
   
    if (error) {
      return console.error(error.message);

    }
    if(results[0].password == req.body.password){
      res.json(results[0])
     }else{
      res.status(400).json('unable to get user')
     }
    
   })
  
});


app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  
    const sql = `INSERT INTO users (id, email, name, password) VALUES (NULL, '${email}', '${name}', '${password}')`;
    let rsql = `select * from users where email = '${req.body.email}'`;
    const values = [email, name, password];
    db.query(sql, values, (error, results) => {
        if (error) {
          return console.error(error.message);
    
        }else{
          
          db.query(rsql, values, (error, results) => {
            if(error){
              return console.error(error.message);
            }
            else {
              console.log(results)
              res.json(results[0])
            }
          })
         
        }
       
    });
  });
  

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  console.log(id)
  const sql = `UPDATE users SET entries = entries + 1 WHERE id = ${id}`;
  const rsql = `SELECT * FROM users WHERE id = ${id}`;
  db.query(sql, function (error, results, fields) {
  if (error) throw error

}

), db.query(rsql, function (error, results, fields) {
  if (error) throw error
  console.log(results)
  res.json(results[0].entries);
}

)}); 


app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
