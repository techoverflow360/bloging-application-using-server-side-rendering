const express = require('express');
require('dotenv').config();
const { connectToDatabase } = require('./connection');
const path = require('path');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/user', userRoutes);

connectToDatabase().then(() => console.log("Connected To Database !")).catch(err => console.log(err));
app.listen(process.env.PORT, () => console.log(`Server has started at port : ${process.env.PORT}`));