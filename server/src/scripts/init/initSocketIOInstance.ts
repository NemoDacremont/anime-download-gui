
import http from 'http';
import socketIO from 'socket.io';

// Stores
import socketIOStore from '../../stores/socketIO';

export default function (httpServer: http.Server): void {
	socketIOStore.socketIOInstance = new socketIO.Server(httpServer, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});
	const socketio = socketIOStore.socketIOInstance;

	socketio.on('connect', (socket) => {
		console.log(`socket ${socket.id} connected`);

		socket.on('disconnect', () => {
			console.log(`socket ${socket.id} disconnected`);
		})
	});

}

