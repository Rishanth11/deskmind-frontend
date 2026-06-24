// src/services/ticketService.js

const API_URL = 'http://localhost:8080/api/tickets';

// Helper to get the JWT from local storage
const getToken = () => localStorage.getItem('userToken');

export const getMyTickets = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/my`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
};

export const createTicket = async (ticketData) => {
    const token = getToken();
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
    });

    if (!response.ok) throw new Error('Failed to create ticket');
    return response.json();
};