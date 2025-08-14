import { io } from 'socket.io-client';

const socket = io('https://coursexpert-backend.up.railway.app'); // Your backend

export default socket;
