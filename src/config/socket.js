import { io } from 'socket.io-client';
const SOCKET_URL = 'https://musicworld-be.onrender.com';
// const SOCKET_URL = 'http://10.0.2.2:4000';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('🟢 Socket connected:', socket.id);
});

socket.on('reconnect', attempt => {
  console.log('🔁 Socket reconnected after', attempt, 'attempts');
});

socket.on('disconnect', reason => {
  console.log('🔴 Socket disconnected:', reason);
});

socket.on('connect_error', err => {
  console.log('⚠️ Socket connection error:', err.message);
});

export default socket;
