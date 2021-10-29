
import socketIO from 'socket.io';

export interface SocketIOStore {
	socketIOInstance: socketIO.Server | null;
}

export const socketIOStore: SocketIOStore = {
	socketIOInstance: null
}

export default socketIOStore;
