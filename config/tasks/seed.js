const connection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.bands;
const restaurants = data.restaurants;
const reviews = data.reviews
const comments = data.comments

const main = async () => {
    const db = await connection();
	await db.dropDatabase();

    console.log('Done seeding database for Band Collection!');
	await db.serverConfig.close();
};

main().catch(error => {
    console.log(error);
});