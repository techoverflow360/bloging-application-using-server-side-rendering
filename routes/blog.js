const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const email = req.user.email.split('@')[0];
      const dirUrl = `./public/uploads/${email}`;
  
      // Check if directory already exists using fs.exists (deprecated) or fs.promises.access
      fs.promises.access(dirUrl, fs.constants.F_OK) // Using fs.promises.access
        .then(() => {
          // Folder exists, use it directly
          cb(null, path.resolve(dirUrl));
        })
        .catch((err) => {
          // Folder doesn't exist, create it
          fs.mkdir(dirUrl, (err) => {
            if (err) {
              return cb(err);
            }
            cb(null, path.resolve(dirUrl));
          });
        });
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()} - ${file.originalname}`;
      cb(null, filename);
    },
  });
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/add-new', (req, res) => {
    res.render('addblog', { user: req.user });
});

router.post('/', upload.single('coverImageURL') ,async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const { title, body } = req.body;
    const filename = req.file.filename;
    const blog = await Blog.create({
        title: title, 
        body: body, 
        coverImageURL: filename, 
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;