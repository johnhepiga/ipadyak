import { io } from 'socket.io-client';

const ws = io.connect(process.env.REACT_APP_SOCKET_URL);

export { ws };
