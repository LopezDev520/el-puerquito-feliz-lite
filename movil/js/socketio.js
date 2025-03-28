const socket = io();
const token = localStorage.getItem('token');
socket.emit('identificar', token);