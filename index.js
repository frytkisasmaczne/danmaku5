'use strict'
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import Game from './game.js';
import Network from './network.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

let game = new Game(io);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("static"));
app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
	console.log(`user ${socket.id} connected`);
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	// socket.on('chat message', (msg) => {
  //   console.log('message: ' + msg);
	// 	io.emit('chat message', msg);
  // });
	socket.onAny((eventName, ...args) => {
		// game.network.
		io.emit(eventName, ...args);
	});
	game.players.push({socket: socket});
});

server.listen(3000, () => {
	console.log('server running at http://localhost:3000');
});

await new Promise(resolve => setTimeout(resolve, 5000));
console.log("idfk");
game.fn.step.main();
// setTimeout(()=>{game.network.})
