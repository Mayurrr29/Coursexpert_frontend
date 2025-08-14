import { io } from 'socket.io-client';

const socket = io('https://coursexpertbackend-production.up.railway.app'); // Your backend
//  const socket = io("http://localhost:5000"); // Your backend
export default socket;
