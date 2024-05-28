const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

const db = require('../data/database');


class User {
    constructor(email, password, fullname, street, postal, city) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street, //第二个street指的constructor里的参数street
            postalCode: postal,
            city: city,
        };

    }

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);
        return db.getDb().collection('users').findOne({_id: uid}, {projection: {password: 0}}); //不查找password
    }
 
    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email});
    }


    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if(existingUser) {
            return true;
        }
        return false;
    }

    async signup() {
        const hashedPassword  = await bcrypt.hash(this.password, 12);

        const result = await db.getDb().collection('users').insertOne({
            email: this.email,
            // password: this.password,//hash
            password: hashedPassword,
            name: this.name,
            address: this.address
        });
    }

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }
}

// new User();

module.exports = User;