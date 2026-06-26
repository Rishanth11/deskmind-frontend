const API_BASE = 'https://deskmind-3kq3.onrender.com';
const API_URL = `${API_BASE}/api/tickets`;

const getToken = () => localStorage.getItem('userToken');

export const getMyTickets = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}/my-tickets`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        if (response.status === 403) throw new Error("403");
        throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    return await response.json();
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