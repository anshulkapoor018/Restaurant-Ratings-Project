const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require('uuid/v4');

module.exports = {
    async addUser(firstName, lastName, email, profilePicture, city, state, age, hashedPassword) {
        if (!firstName || (typeof firstName != "string")) throw "must give first name as a string";
        if (!lastName || (typeof lastName != "string")) throw "must give last name as a string";
        if (!email || (typeof email != "string")) throw "must give email as a string";
        if (!profilePicture || (typeof profilePicture != "string")) throw "must give profilePicture as a string";
        if (!city || (typeof city != "string")) throw "must give city as a string";
        if (!state || (typeof state != "string")) throw "must give state as a string";
        if (!age || (typeof age != "string")) throw "must give age as a string";
        if (!hashedPassword || (typeof hashedPassword != "string")) throw "must give hashed password as a string";
        const userCollection = await users();
        let newUser = {
            _id: uuid(),
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
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "could not add user";
        return await this.getUser(insertInfo.insertedId);
    },

    async getUser(id) {
        if (!id) throw "id must be given";
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
    }
}