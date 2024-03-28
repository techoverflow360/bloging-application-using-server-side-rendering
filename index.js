const express = require('express');
require('dotenv').config();
const { connectToDatabase } = require('./connection');
const path = require('path');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser({extended: false}));
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', async (req, res) => {
    const allBlog = await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs: allBlog,
    });
})

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

connectToDatabase().then(() => console.log("Connected To Database !")).catch(err => console.log(err));
app.listen(process.env.PORT, () => console.log(`Server has started at port : ${process.env.PORT}`));