const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const restaurants = mongoCollections.restaurants;
// const uuid = require('uuid/v4');

module.exports = {
    async addRestaurant(name, website, category, address, city, state, zip, latitude, longitude) {
        if (!name || (typeof name != "string")) throw "must give name as a string";
        if (!website || (typeof website != "string")) throw "must give website as a string";
        if (!category || (typeof category != "string")) throw "must give category as a string";
        if (!address || (typeof address != "string")) throw "must give address as a string";
        if (!city || (typeof city != "string")) throw "must give city as a string";
        if (!state || (typeof state != "string")) throw "must give state as a string";
        if (!zip || (typeof zip != "string")) throw "must give zip as a string";
        if (!longitude || (typeof longitude != "number")) throw "must give longitude as a number";
        if (!latitude || (typeof latitude != "number")) throw "must give latitude as a number";
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
            owner: "",
            rating: 0,
            reviews: [],
        }
        const insertInfo = await restaurantCollection.insertOne(newRestaurant);
        if (insertInfo.insertedCount === 0) throw "could not add restaurant";
        const newId = insertInfo.insertedId;
        const newIDString = String(newId);
        const restaurant = await this.getRestaurant(newIDString);
        return restaurant;
    },

    async addRestaurantWithOwner(name, website, category, address, city, state, zip, latitude, longitude, owner) {
        if (!name || (typeof(name) !== "string")) throw "Error (addRestaurantWithOwner): Name must be included as a string.";
        if (!website || (typeof(website) !== "string")) throw "Error (addRestaurantWithOwner): Website must be included as a string.";
        if (!category || (typeof(category) !== "string")) throw "Error (addRestaurantWithOwner): Category must be included as a string.";
        if (!address || (typeof(address) !== "string")) throw "Error (addRestaurantWithOwner): Address must be included as a string.";
        if (!city || (typeof(city) !== "string")) throw "Error (addRestaurantWithOwner): City must be included as a string.";
        if (!state || (typeof(state) !== "string")) throw "Error (addRestaurantWithOwner): State must be included as a string.";
        if (!zip || (typeof(zip) !== "string")) throw "Error (addRestaurantWithOwner): Zip must be included as a string.";
        if (!longitude || (typeof(longitude) !== "number")) throw "Error (addRestaurantWithOwner): Longitude must be included as a float.";
        if (!latitude || (typeof(latitude) !== "number")) throw "Error (addRestaurantWithOwner): Latitude must be included as a float.";
        if (!owner) throw "Error (addRestaurantWithOwner): Owner ID must be included.";
        if (typeof(owner) === "string") owner = ObjectId.createFromHexString(owner);
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
            owner: owner,
            rating: 0,
            reviews: [],
        }
        const insertInfo = await restaurantCollection.insertOne(newRestaurant);
        if (insertInfo.insertedCount === 0) throw "Error (addRestaurantWithOwner): Failed to add restaurant to DB.";
        const id = insertInfo.insertedId;
        const restaurant = await this.getRestaurant(id);
        return restaurant;
    },

    async updateRestaurant(id, name, website, category, address, city, state, zip, latitude, longitude) {
        if (!id) throw "Error (updateRestaurant): Restaurant ID must be included.";
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        if (!name || (typeof(name) !== "string")) throw "Error (updateRestaurant): Name must be included as a string.";
        if (!website || (typeof(website) !== "string")) throw "Error (updateRestaurant): Website must be included as a string.";
        if (!category || (typeof(category) !== "string")) throw "Error (updateRestaurant): Category must be included as a string.";
        if (!address || (typeof(address) !== "string")) throw "Error (updateRestaurant): Address must be included as a string.";
        if (!city || (typeof(city) !== "string")) throw "Error (updateRestaurant): City must be included as a string.";
        if (!state || (typeof(state) !== "string")) throw "Error (updateRestaurant): State must be included as a string.";
        if (!zip || (typeof(zip) !== "string")) throw "Error (updateRestaurant): Zip must be included as a string.";
        if (!longitude || (typeof(longitude) !== "number")) throw "Error (updateRestaurant): Longitude must be included as a float.";
        if (!latitude || (typeof(latitude) !== "number")) throw "Error (updateRestaurant): Latitude must be included as a float.";
        const restaurantCollection = await restaurants();
        let updatedRestaurant = {
            name: name,
            website: website,
            category: category,
            address: address,
            city: city,
            state: state,
            zip: zip,
            longitude: longitude,
            latitude: latitude
        }
        const updateInfo = await restaurantCollection.updateOne({ _id: id }, {$set: updatedRestaurant});
        if (updateInfo.modifiedCount === 0) throw "Error (updateRestaurant): Failed to update restaurant in DB.";
        const restaurant = await this.getRestaurant(id);
        return restaurant;
    },

    async getRestaurant(id) {
        if (!id) throw "id must be given";
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const restaurantCollection = await restaurants();
        const restaurant = await restaurantCollection.findOne({ _id: id});
        if (!restaurant) throw "restaurant with that id does not exist";
        return restaurant;
    },

    async getRestaurantsViaSearch(search) {
        if (!search) throw "Error (getRestaurantsViaSearch): Must provide search.";
        if (typeof(search) !== "string") throw "Error (getRestaurantsViaSearch): Search must be a string.";
        const restaurantCollection = await restaurants();
        const query = new RegExp(search, "i");
        const restaurantList = await restaurantCollection.find({ $or: [ {category: {$regex: query}}, {name: {$regex: query}} ] }).toArray();
        return restaurantList;
    },

    async getRestaurantsByOwner(ownerId) {
        if (!ownerId) throw "Error (getRestaurantsByOwner): Must provide ID of owner to find restaurants for.";
        if (typeof(ownerId) === "string") ownerId = ObjectId.createFromHexString(ownerId);
        const restaurantCollection = await restaurants();
        const restaurantList = await restaurantCollection.find({ owner: ownerId }).toArray();
        return restaurantList;
    },

    async getAllRestaurants() {
        const restaurantCollection = await restaurants();
        const restaurantList = await restaurantCollection.find({}).toArray();
        if (restaurantList.length === 0) throw "no restaurants in the collection";
        return restaurantList;
    },

    async checkRestaurantOwnership(restaurantId, userId) {
        if (!userId) throw "Error (checkRestaurantOwnership): Must provide ID of user to check.";
        if (!restaurantId) throw "Error (checkRestaurantOwnership): Must provide ID of restaurant to check.";
        if (typeof(userId) === "string") userId = ObjectId.createFromHexString(userId);
        if (typeof(restaurantId) === "string") restaurantId = ObjectId.createFromHexString(restaurantId);
        const restaurantCollection = await restaurants();
        const restaurantList = await restaurantCollection.find({ owner: userId }).toArray();
        for (restaurant of restaurantList) {
            if (restaurantId === restaurant._id) {
                return true; // Break, restaurant is in user's owned list
            }
        }
        return false; // User does not own restaurant
    }
}