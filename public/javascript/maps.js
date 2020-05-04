// Derived from the Google Maps JS API documentation

let script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC-T5kdfwDYmBUXQ6pw5xv4YkQc6bWsidE&callback=initMap';
script.defer = true;
script.async = false;

const latitude = parseFloat(document.currentScript.getAttribute('latitude'));
const longitude = parseFloat(document.currentScript.getAttribute('longitude'));

window.initMap = function() {
    let gmap = new google.maps.Map(document.getElementById('gmap'), {
        center: {lat: longitude, lng: latitude}, // TODO: This will need to be fixed, some lat/lng combos are reversed in DB
        zoom: 16
    });
    let marker = new google.maps.Marker({position: {lat: longitude, lng: latitude}, map: gmap});
}

document.head.appendChild(script);