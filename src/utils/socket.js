import { io } from 'socket.io-client';

const socket = io('coursexpertbackend-production.up.railway.app'); // Your backend

export default socket;
