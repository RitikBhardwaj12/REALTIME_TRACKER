// Initialize Socket.io connection
const socket = io();

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);

// Object to store markers for each user
const userMarkers = {};

// Track user's geolocation and emit to server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

// Handle receiving location updates from server
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Check if marker already exists for this user
    if (!(id in userMarkers)) {
        // Create a new marker for the user
        userMarkers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        // Update existing marker position
        userMarkers[id].setLatLng([latitude, longitude]);
    }

    // Optionally center the map on the user's latest location
    map.setView([latitude, longitude], 14);
});


socket.on("user-disconnected",(id)=> {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});