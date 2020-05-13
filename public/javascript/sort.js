function getAllCards() {
    let cards = document.getElementsByClassName("card");
    let restaurants = [];
    for (card of cards) {
        let restaurant = {};
        restaurant.link = card.children[0].children[0].getAttribute("href"); // Targets link of <a>, with id
        restaurant.name = card.children[0].children[0].innerHTML; // Targets content of <a>, name
        restaurant.category = card.children[1].innerHTML;
        restaurant.address = card.children[2].innerHTML;
        restaurant.address2 = card.children[3].innerHTML;
        restaurant.rating = card.children[4].innerHTML;
        restaurants.push(restaurant);
    }
    return restaurants;
}

function sortCardsAscending() {
    restaurants = getAllCards();
    restaurants.sort(lowToHigh);
    let cards = document.getElementsByClassName("card");
    while(cards[0]) { // Delete all card elements on page
        cards[0].remove();
    }
    const parentDiv = document.getElementsByClassName("restaurant_Collection")[0];
    for (restaurant of restaurants) { // Reinstantiate all cards in sorted order
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        div.setAttribute("onClick", "location.href=" + restaurant.link + ";");
        let h2 = document.createElement("h2");
        let a = document.createElement("a");
        a.setAttribute("href", restaurant.link);
        a.innerHTML = restaurant.name;
        h2.appendChild(a);
        div.appendChild(h2);
        let p1 = document.createElement("p");
        p1.setAttribute("class", "category");
        p1.innerHTML = restaurant.category;
        div.appendChild(p1);
        let p2 = document.createElement("p");
        p2.innerHTML = restaurant.address;
        div.appendChild(p2);
        let p3 = document.createElement("p");
        p3.innerHTML = restaurant.address2;
        div.appendChild(p3);
        let p4 = document.createElement("p");
        p4.setAttribute("class", "avg");
        p4.innerHTML = restaurant.rating;
        div.appendChild(p4);
        div.appendChild(document.createElement("br"))
        parentDiv.append(div);
    }
}

function sortCardsDescending() {
    restaurants = getAllCards();
    restaurants.sort(highToLow);
    let cards = document.getElementsByClassName("card");
    while(cards[0]) {
        cards[0].parentNode.removeChild(cards[0]);
    }
    const parentDiv = document.getElementsByClassName("restaurant_Collection")[0];
    for (restaurant of restaurants) {
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        div.setAttribute("onClick", "location.href=" + restaurant.link + ";");
        let h2 = document.createElement("h2");
        let a = document.createElement("a");
        a.setAttribute("href", restaurant.link);
        a.innerHTML = restaurant.name;
        h2.appendChild(a);
        div.appendChild(h2);
        let p1 = document.createElement("p");
        p1.setAttribute("class", "category");
        p1.innerHTML = restaurant.category;
        div.appendChild(p1);
        let p2 = document.createElement("p");
        p2.innerHTML = restaurant.address;
        div.appendChild(p2);
        let p3 = document.createElement("p");
        p3.innerHTML = restaurant.address2;
        div.appendChild(p3);
        let p4 = document.createElement("p");
        p4.setAttribute("class", "avg");
        p4.innerHTML = restaurant.rating;
        div.appendChild(p4);
        div.appendChild(document.createElement("br"));
        parentDiv.append(div);
    }
}

function lowToHigh(a, b) {
    ratingA = a.rating.substring(0, 3);
    ratingB = b.rating.substring(0, 3); // Non-numerical ratings should sort to bottom regardless
    if (ratingB === "No ") return -1 // It isn't really important to check contents of other string
    if (ratingA === "No ") return 1 // If both are non-numerical, the sort will be stable
    return parseFloat(ratingA)-parseFloat(ratingB)
}

function highToLow(a, b) {
    ratingA = a.rating.substring(0, 3);
    ratingB = b.rating.substring(0, 3); 
    if (ratingB === "No ") return -1
    if (ratingA === "No ") return 1
    return parseFloat(ratingB)-parseFloat(ratingA)
}