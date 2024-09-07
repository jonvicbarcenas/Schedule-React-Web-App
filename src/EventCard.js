// src/EventCard.js
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EventCard = ({ title, date, onEdit, onDelete }) => {
  return (
    <div className="event-card">
      <div className="event-details">
        <h4>{title}</h4>
        <span>{date}</span>
      </div>
      <div className="event-actions">
        <FaEdit className="icon" onClick={onEdit} />
        <FaTrash className="icon" onClick={onDelete} />
      </div>
    </div>
  );
};

export default EventCard;
