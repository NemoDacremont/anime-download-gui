
import socketIO from 'socket.io';

export interface SocketIOStore {
	socketIOInstance: socketIO.Server | null;
}

const socketIOStore: SocketIOStore = {
	socketIOInstance: null
}

export default socketIOStore;
