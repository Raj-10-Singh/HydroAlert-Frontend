import { io } from 'socket.io-client';
import { SERVER } from '../config';

let sock = null;

export const connect = () => {
  if (sock) return sock;
  sock = io(SERVER, { transports: ['websocket'] });
  return sock;
};

export const get = () => sock;

export const joinZone = (zoneId) => sock?.emit('join-zone', zoneId);