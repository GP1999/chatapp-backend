const uuid = require('uuid');
const ChatApp = require('../Databases/MongoDb.js').db('ChatApp');
const {pbkdf2Sync} = require('crypto');
const radisClient=require('../Databases/radis.js');
class User {
    constructor(email, name, password) {
        this.email = email.trim();
        this.name = name.trim();
        this.password = pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');

    }
    //TO validate User Info
    isValid() {
        const mail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const nameValid = /^[a-zA-Z\s]+$/;

        let isMailValid = false,
            isNameValid = false;
        if (mail.test(this.email)) 
            isMailValid = true;
        
        if (nameValid.test(this.name)) 
            isNameValid = true;
        

        return {
            isValid: isMailValid && isNameValid,
            isMailValid: isMailValid,
            isNameValid: isNameValid
        }
    }
    getObject() {
        return {email: this.email, name: this.name, password: this.password}
    }

    //Save the NewUser Information in MongoDb Database
    //It will return Promise

    saveInMongo() {
        return  ChatApp.collection('Users').insertOne(this.getObject());
    }
}

module.exports = User
