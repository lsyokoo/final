const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

// Create HTTP server and Socket.IO instance
const server = createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve static files like chat.html

// RSVP store the username
let rsvpList = { event1: [], event2: [], event3: [] };

// Chat messages storage ( debugging
let chatMessages = [];

// POST /api/username - Store username
let usernames = [];
app.post('/api/username', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }
    usernames.push(username);
    return res.status(201).json({ message: 'Username saved.', usernames });
});

// GET /api/usernames - Get stored usernames
app.get('/api/usernames', (req, res) => {
    res.status(200).json(usernames);
});

// POST /api/rsvp - Submit RSVP
app.post('/api/rsvp', (req, res) => {
    const { username, eventId } = req.body;

    if (!username || !eventId) {
        return res.status(400).json({ message: 'Username and eventId are required.' });
    }

    if (!rsvpList[eventId]) {
        return res.status(400).json({ message: 'Invalid eventId.' });
    }

    if (rsvpList[eventId].includes(username)) {
        return res.status(400).json({ message: 'You have already RSVP’d for this event.' });
    }

    rsvpList[eventId].push(username);
    res.status(201).json({ message: 'RSVP successful!', rsvpList });
});

// GET /api/rsvp - Get RSVP lists
app.get('/api/rsvp', (req, res) => {
    res.status(200).json(rsvpList);
});


// Serve chat.html
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// WebSocket for real-time communication
io.on('connection', (socket) => {
    console.log('A user connected.');

    // Send current chat messages to the newly connected client
    socket.emit('chat history', chatMessages);

    // Handle chat message
    socket.on('chat message', (data) => {
        console.log('Message received:', data);
        chatMessages.push(data); // Optional: Store chat messages
        io.emit('chat message', data); // Broadcast message to all clients
    });

    // Handle RSVP event
    socket.on('rsvp', (data) => {
        const { eventId, username } = data;
        if (!rsvpList[eventId].includes(username)) {
            rsvpList[eventId].push(username);
            io.emit('rsvp update', rsvpList); // Broadcast updated RSVP list
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
