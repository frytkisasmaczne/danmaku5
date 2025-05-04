'use strict'
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import Game from './game.js';
import { Sema } from './lib.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);

const io = new Server(server);
let game = new Game(io);

const players_connected = new Sema();
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
	let player = {socket: socket, uuid: uuidv4()};
	game.players.push(player);
	game.uuid[player.uuid] = player;
	// if (game.players.length >= 4)
	players_connected.resolve();
});


app.use(express.static("static"));
app.get('/', (req, res) => {
	res.sendFile(join(__dirname, 'static/index.html'));
});

server.listen(3000, () => {
	console.log('server running at http://localhost:3000');
});

// await new Promise(resolve => setTimeout(resolve, 50000));
await players_connected.promise;

console.log("idfk");
game.fn.step.main();
