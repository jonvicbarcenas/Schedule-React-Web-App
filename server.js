// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3001;
const EVENTS_DB = './events.json';

// Middleware
app.use(cors()); // Allow Cross-Origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Helper function to read JSON file
const readEvents = () => {
  const data = fs.readFileSync(EVENTS_DB);
  return JSON.parse(data);
};

// Helper function to write to JSON file
const writeEvents = (data) => {
  fs.writeFileSync(EVENTS_DB, JSON.stringify(data, null, 2));
};

// Get all events
app.get('/events', (req, res) => {
  const events = readEvents();
  res.json(events);
});

// Add a new event
app.post('/events', (req, res) => {
  const events = readEvents();
  const newEvent = { id: Date.now(), ...req.body };
  events.push(newEvent);
  writeEvents(events);
  res.status(201).json(newEvent);
});

// Update an event
app.put('/events/:id', (req, res) => {
  const events = readEvents();
  const eventId = parseInt(req.params.id);
  const updatedEvent = req.body;

  const updatedEvents = events.map((event) =>
    event.id === eventId ? { ...event, ...updatedEvent } : event
  );

  writeEvents(updatedEvents);
  res.json(updatedEvent);
});

// Delete an event
app.delete('/events/:id', (req, res) => {
  const events = readEvents();
  const eventId = parseInt(req.params.id);
  const updatedEvents = events.filter((event) => event.id !== eventId);

  writeEvents(updatedEvents);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
