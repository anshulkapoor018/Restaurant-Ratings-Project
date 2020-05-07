const connection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const restaurants = data.restaurants;
const reviews = data.reviews
const comments = data.comments

const main = async () => {
    const db = await connection();
    await db.dropDatabase();

    //Seed Sample Restaurants
    const R1 = await restaurants.addRestaurant("Papa Johns", "papajohns.com", "Pizza", "125 18th Street", "Jersey City", "NJ", "07310", 40.732628, -74.037628, "123456789");
    const R2 = await restaurants.addRestaurant("Chef Of India", "chefofindia.com", "Indian", "324 Central Ave", "Jersey City", "NJ", "07307", 40.7459498, -74.0512955, "123456789");
    const R3 = await restaurants.addRestaurant("Vibez Juice & Vegan Cafe", "chefofindia.com", "Juice", "82 Hutton St", "Jersey City", "NJ", "07307", 40.7445109, -74.0514578, "123456789");
    const R4 = await restaurants.addRestaurant("El Gordo", "elgordoeats.com", "Peruvian", "291 Central Ave", "Jersey City", "NJ", "07310", 40.7450379, -74.0524309, "123456789");
    const R5 = await restaurants.addRestaurant("The Franklin", "thefranklinjc.com", "Italian", "159 New York Ave", "Jersey City", "NJ", "07310", 40.7417174, -74.0491971, "123456789");
    const R6 = await restaurants.addRestaurant("Dino & Harry's Steakhouse", "dinoandharrys.com", "Steak", "163 14th St", "Hoboken", "NJ", "07030", 40.7534212, -74.0299569, "123456789");
    const R7 = await restaurants.addRestaurant("La Isla", "laislarestaurant.com", "Cuban", "104 Washington St", "Hoboken", "NJ", "07310", 40.7228179, -74.1316417, "123456789");
    const R8 = await restaurants.addRestaurant("Ali Baba Restaurant", "hobokenalibaba.com", "Middle Eastern", "912 Washington St Ste 1", "Hoboken", "NJ", "07310", 40.7477496, -74.0302254, "123456789");
    const R9 = await restaurants.addRestaurant("South Street Fish & Ramen Co.", "southstreet.co", "Japanese", "219 Washington St", "Hoboken", "NJ", "07310", 40.7393196, -74.032313, "123456789");
    const R10 = await restaurants.addRestaurant("GreekTown", "greektown-hoboken.com", "Greek", "86 Garden St", "Hoboken", "NJ", "07310", 40.7369868, -74.3132926, "123456789");


    //Seed Sample Users
    const U1 = await users.addUser("Anna", "Brown", "anna@gmail.com", "", "Jersey City", "NJ", "21", "$2a$16$55b4ftaRCsHZcJ2X3VAmL.X85wi/K3ydOMWRoyafn2ubiA38l4HnK");
    // const U2 = await users.addUser("Anshul", "Kapoor", "Anshul@gmail.com", "", "Jersey City", "NJ", "25", "123456789");
    // const U3 = await users.addUser("Kamil", "Zambrowski", "Kamil@gmail.com", "", "Jersey City", "NJ", "22", "123456789");
    // const U4 = await users.addUser("Michael", "Lyons", "Michael@gmail.com", "", "Jersey City", "NJ", "22", "123456789");
    // const U5 = await users.addUser("John", "Doe", "John@gmail.com", "", "Jersey City", "NJ", "22", "123456789");
    // const U6 = await users.addUser("Ava", "Tartaglia", "Ava@gmail.com", "", "Hoboken", "NJ", "23", "123456789");
    // const U7 = await users.addUser("Dan", "Pelis", "Dan@gmail.com", "", "Hoboken", "NJ", "24", "123456789");
    // const U8 = await users.addUser("Jessica", "Su", "Jessica@gmail.com", "", "Hoboken", "NJ", "25", "123456789");
    // const U9 = await users.addUser("Miles", "Rosenberg", "Miles@gmail.com", "", "Hoboken", "NJ", "28", "123456789");
    // const U10 = await users.addUser("Joe", "Smith", "Joe@gmail.com", "", "Hoboken", "NJ", "26", "123456789");

    //Seed Sample Reviews
    const reviewForR1 = await reviews.addReview(String(R1._id), String(U1._id), "Amazing Food!", 4);
    const reviewForR2 = await reviews.addReview(String(R2._id), String(U1._id), "Amazing Food!", 2);
    const reviewForR3 = await reviews.addReview(String(R3._id), String(U1._id), "Amazing Food!", 3);
    const reviewForR4 = await reviews.addReview(String(R4._id), String(U1._id), "Amazing Food!", 1);
    const reviewForR5 = await reviews.addReview(String(R5._id), String(U1._id), "Amazing Food!", 4);
    const reviewForR6 = await reviews.addReview(String(R6._id), String(U1._id), "Amazing Food!", 5);
    const reviewForR7 = await reviews.addReview(String(R7._id), String(U1._id), "Amazing Food!", 5);
    const reviewForR8 = await reviews.addReview(String(R8._id), String(U1._id), "Amazing Food!", 5);
    const reviewForR9 = await reviews.addReview(String(R9._id), String(U1._id), "Amazing Food!", 4);
    const reviewForR10 = await reviews.addReview(String(R10._id), String(U1._id), "Amazing Food!", 3);

    //Seed Sample Reviews
    const commentForReviewForR1 = await comments.addComment(String(U1._id), String(reviewForR1._id), "Amazing Food!");
    const commentForReviewForR2 = await comments.addComment(String(U1._id), String(reviewForR2._id), "Amazing Food!");
    const commentForReviewForR3 = await comments.addComment(String(U1._id), String(reviewForR3._id), "Amazing Food!");
    const commentForReviewForR4 = await comments.addComment(String(U1._id), String(reviewForR4._id), "Amazing Food!");
    const commentForReviewForR5 = await comments.addComment(String(U1._id), String(reviewForR5._id), "Amazing Food!");
    const commentForReviewForR6 = await comments.addComment(String(U1._id), String(reviewForR6._id), "Amazing Food!");
    const commentForReviewForR7 = await comments.addComment(String(U1._id), String(reviewForR7._id), "Amazing Food!");
    const commentForReviewForR8 = await comments.addComment(String(U1._id), String(reviewForR8._id), "Amazing Food!");
    const commentForReviewForR9 = await comments.addComment(String(U1._id), String(reviewForR9._id), "Amazing Food!");
    const commentForReviewForR10 = await comments.addComment(String(U1._id), String(reviewForR10._id), "Amazing Food!");
    console.log('Done seeding database for Restaurant Collection!');
	await db.serverConfig.close();
};

main().catch(error => {
    console.log(error);
});