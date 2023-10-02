const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB (you need to configure your database connection)
mongoose.connect('mongodb://localhost/employee_chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose model for chat messages
const ChatMessage = mongoose.model('ChatMessage', {
  sender: String,
  message: String,
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for new chat messages
  socket.on('chat message', async (messageData) => {
    const message = new ChatMessage(messageData);
    await message.save();
    io.emit('chat message', message); // Broadcast the message to all connected clients
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
