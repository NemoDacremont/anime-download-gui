
import http from 'http';
import socketIO from 'socket.io';

// Stores
import socketIOStore from '../../stores/socketIO';

export default function (httpServer: http.Server): void {
	socketIOStore.socketIOInstance = new socketIO.Server(httpServer);
	const socketio = socketIOStore.socketIOInstance;

	socketio.on('connect', () => {
		console.log('socketio: new user connected');
	});
}

