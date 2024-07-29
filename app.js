const express = require("express");
const app = express();
const path = require('path');
const http = require('http'); // Corrected import

const socketio = require("socket.io");
const server = http.createServer(app); // Create HTTP server
const io = socketio(server);

// Set view engine and views directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection handling
io.on("connection", function(socket) {
    console.log("New client connected:", socket.id);

    // Receive location from client and broadcast to all clients
    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle client disconnects
    socket.on("disconnect", function() {
        console.log("Client disconnected:", socket.id);
        // Clean up if needed
    });

    socket.on("disconnect",function(){
        io.emit("user-disconnected")
    })
});

// Route for rendering the index.ejs file
app.get("/", function(req, res) {
    res.render("index");
});

// Start server on port 3000
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
