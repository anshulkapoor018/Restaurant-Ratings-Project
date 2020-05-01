const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const restaurants = mongoCollections.restaurants;
// const uuid = require('uuid/v4');

module.exports = {
    async addRestaurant(name, website, category, address, city, state, zip, longitude, latitude, hashedPassword) {
        if (!name || (typeof name != "string")) throw "must give name as a string";
        if (!website || (typeof website != "string")) throw "must give website as a string";
        if (!category || (typeof category != "string")) throw "must give category as a string";
        if (!address || (typeof address != "string")) throw "must give address as a string";
        if (!city || (typeof city != "string")) throw "must give city as a string";
        if (!state || (typeof state != "string")) throw "must give state as a string";
        if (!zip || (typeof zip != "string")) throw "must give zip as a string";
        if (!longitude || (typeof longitude != "number")) throw "must give longitude as a number";
        if (!latitude || (typeof latitude != "number")) throw "must give latitude as a number";
        if (!hashedPassword || (typeof hashedPassword != "string")) throw "must give hashed password as a string";
        const restaurantCollection = await restaurants();
        let newRestaurant = {
            name: name,
            website: website,
            category: category,
            address: address,
            city: city,
            state: state,
            zip: zip,
            longitude: longitude,
            latitude: latitude,
            rating: 0,
            hashedPassword: hashedPassword,
            reviews: [],
        }
        const insertInfo = await restaurantCollection.insertOne(newRestaurant);
        if (insertInfo.insertedCount === 0) throw "could not add restaurant";
        const newId = insertInfo.insertedId;
        const newIDString = String(newId);
        const restaurant = await this.getRestaurant(newIDString);
        return restaurant;
    },

    async getRestaurant(id) {
        if (!id) throw "id must be given";
        const restaurantCollection = await restaurants();
        const objId = ObjectId.createFromHexString(id);
        const restaurant = await restaurantCollection.findOne({ _id: objId});
        if (!restaurant) throw "restaurant with that id does not exist";
        return restaurant;
    },

    async getAllRestaurants() {
        const restaurantCollection = await restaurants();
        const restaurantList = await restaurantCollection.find({}).toArray();
        if (restaurantList.length === 0) throw "no restaurants in the collection";
        return restaurantList;
    }
}