const { ObjectId } = require('mongodb');
const mongoCollections = require("../config/mongoCollections");

const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const comments = mongoCollections.comments;
// const uuid = require('uuid/v4');

module.exports = {
    async addUser(firstName, lastName, email, profilePicture, city, state, age, hashedPassword) {
        if (!firstName || (typeof firstName != "string")) throw "must give first name as a string";
        if (!lastName || (typeof lastName != "string")) throw "must give last name as a string";
        if (!email || (typeof email != "string")) throw "must give email as a string";
        // if (!profilePicture || (typeof profilePicture != "string")) throw "must give profilePicture as a string";
        if (city == "" || !city){
            city = ""
        } else {
            if (typeof city != "string") {
                throw "must give city as a string";
            }
        }

        if (!state || (typeof state != "string")) throw "must give state as a string";
        if (!age || (typeof age != "string")) throw "must give age as a string";
        if (!hashedPassword || (typeof hashedPassword != "string")) throw "must give hashed password as a string";
        const userCollection = await users();
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            profilePicture: profilePicture,
            city: city,
            state: state,
            age: age,
            hashedPassword: hashedPassword,
            reviewIds: [],
            commentIds: []
        }
        const userExists = await userCollection.findOne({ email: email});
        if (userExists) throw "Email already in use";
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "could not add user";
        return await this.getUser(insertInfo.insertedId);
    },

    async getUser(id) {
        if (!id) throw "id must be given";
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id});
        if (!user) throw "user with that id does not exist";
        return user;
    },

    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        if (userList.length === 0) throw "no users in the collection";
        return userList;
    },

    async getUserId(username) {    
        if (!username) throw "username must be given";
        const userCollection = await users();
        const userData = await userCollection.findOne({ email: username});
        return userData._id;
    },

    async updateUser(id, updatedUser) {
        if (!id) throw "id is missing";
        if (!updatedUser) {
            return await this.getUser(id);
        }
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const userCollection = await users();
        let updatedUserData = {};
        if (updatedUser === await this.getUser(id)) {
            return await this.getUser(id);
        }

        if (updatedUser.firstName) {
            updatedUserData.firstName = updatedUser.firstName;
        }
        if (updatedUser.lastName) {
            updatedUserData.lastName = updatedUser.lastName;
        }
        if (updatedUser.email) {
            updatedUserData.email = updatedUser.email;
        }
        if (updatedUser.profilePicture) {
            updatedUserData.profilePicture = updatedUser.profilePicture;
        }
        if (updatedUser.city) {
            updatedUserData.city = updatedUser.city;
        }
        if (updatedUser.state) {
            updatedUserData.state = updatedUser.state;
        }
        if (updatedUser.age) {
            updatedUserData.age = updatedUser.age;
        }
        if (updatedUser.hashedPassword) {
            updatedUserData.hashedPassword = updatedUser.hashedPassword;
        }
        if (updatedUserData = {}) {
            return await this.getUser(id);
        }
        const updateInfoUser = await userCollection.updateOne({ _id: id }, { $set: updatedUserData });
        if (updateInfoUser.modifiedCount === 0) throw "could not update user";
        return await this.getUser(id);
    }
}