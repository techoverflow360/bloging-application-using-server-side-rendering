const mongoose = require('mongoose');
require('dotenv').config();

function connectToDatabase() {
    return mongoose.connect(process.env.MONGO_URL);
}

module.exports = {
    connectToDatabase,
}