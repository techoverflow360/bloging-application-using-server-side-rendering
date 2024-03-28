const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
    },
    salt: {
        type: String,
    },
    password: {
        type:String,
        required: true,
    },
    profileImageURL : {
        type: String,
        default: '/images/user-avatar.png',
    },
    role : {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, { timestamps : true }) 

// before saving the changes or any creation, we perform a task that is there inside the mongoose.pre() 
userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return;
    // random salt for every user 
    const salt = randomBytes(16).toString();
    // a hashed password is created for every password 
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    // update the changes into the current user 
    user.salt = salt;
    user.password = hashedPassword;
    next();
});

// here we made a normal function for our purposes 
userSchema.static('matchPassword', async function(email, password) {
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found !');
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHashed = createHmac('sha256', salt).update(password).digest('hex');
    if(userProvidedHashed !== hashedPassword) throw new Error('Password doesnot matched !');

    // we are not passing the password and salt 
    return user;
})

const User = mongoose.model('user', userSchema);

module.exports = User;