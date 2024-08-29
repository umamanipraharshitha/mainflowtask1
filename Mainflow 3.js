const mysql = require('mysql');        
const mongoose = require('mongoose');  
const express = require('express');    
const bodyParser = require('body-parser'); 
const cors = require('cors');         

const app = express();
app.use(bodyParser.json());
app.use(cors());


const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mysql_db'
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

  
    mysqlConnection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return;
        }

        results.forEach(row => {
            const newUser = new User({
                name: row.name,
                age: row.age
            });

            newUser.save()
                .then(() => console.log(`Migrated User: ${row.name}`))
                .catch(err => console.error('Error saving to MongoDB:', err));
        });
    });
});


mongoose.connect('mongodb://localhost:27017/mongodb_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const UserSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model('User', UserSchema);




app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});


app.post('/users', async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
});


app.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
});


app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
