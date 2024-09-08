// src/Scheduler.js
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // For formatting the date


// YOU CAN CUSTOMIZE THE IP ADDRESS BELOW OR USE THE DEFAULT ONE 'localhost'
const IP = '13.127.169.105';

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });
  const [selectedDate, setSelectedDate] = useState(null); // State for DatePicker
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // Fetch events from the server
  useEffect(() => {
    fetch(`http://${IP}:3001/events`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  // Add a new event
  const addEvent = () => {
    if (newEvent.title && selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const eventToAdd = { ...newEvent, date: formattedDate };
      // if (formattedDate === '2024-09-15') {
      //   eventToAdd.title = 'HAPPY BIRTHDAY BEBOY';
      
      // }
      fetch(`http://${IP}:3001/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventToAdd),
      })
        .then((response) => response.json())
        .then((data) => {
          setEvents([...events, data]);
          setNewEvent({ title: '', date: '' });
          setSelectedDate(null); // Reset date picker
        })
        .catch((error) => console.error('Error adding event:', error));
    }
  };

  // Edit an existing event
  const editEvent = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    setNewEvent({ title: eventToEdit.title, date: eventToEdit.date });
    setSelectedDate(new Date(eventToEdit.date)); // Set date picker with existing date
    setIsEditing(true);
    setEditingEventId(id);
  };

  // Update event after editing
  const updateEvent = () => {
    if (editingEventId !== null && newEvent.title && selectedDate) {
      const updatedEvent = { ...newEvent, date: format(selectedDate, 'yyyy-MM-dd') };
      fetch(`http://${IP}:3001/events/${editingEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      })
        .then((response) => response.json())
        .then(() => {
          setEvents(
            events.map((event) =>
              event.id === editingEventId ? { ...event, ...updatedEvent } : event
            )
          );
          setIsEditing(false);
          setNewEvent({ title: '', date: '' });
          setSelectedDate(null); // Reset date picker
          setEditingEventId(null);
        })
        .catch((error) => console.error('Error updating event:', error));
    }
  };

  // Delete an event
  const deleteEvent = (id) => {
    fetch(`http://${IP}:3001/events/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEvents(events.filter((event) => event.id !== id));
      })
      .catch((error) => console.error('Error deleting event:', error));
  };

  return (
    <div className="scheduler-container">
      <div className="scheduler-header">
        <h2>Scheduler</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Event Date"
            minDate={new Date()} // Restrict past dates
          />
          {isEditing ? (
            <button className="add-event-button" onClick={updateEvent}>
              Update Event
            </button>
          ) : (
            <button className="add-event-button" onClick={addEvent}>
              Add Event
            </button>
          )}
        </div>
      </div>
      <div className="events-list">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            onEdit={() => editEvent(event.id)}
            onDelete={() => deleteEvent(event.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Scheduler;
