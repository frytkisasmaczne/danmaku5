'use strict'
import {Mutex, Semaphore, withTimeout, E_TIMEOUT} from 'async-mutex';
import { Change } from "./lib.js"
import * as base from "./cards/base.js";
import randomUUID from 'node:crypto';

class Game {
	uuid = {/*00-uuid-xd: (card object reference from cards and hands arrays)*/};
	stock_effects = [/*{source_uuid: "00-uuid-xd", fn: (game) => {...}}*/];
	history = [];
	pending_history = [/*{event: "card played",  player: "00-uuid", card: "01-uuid", effect: {modify: {uuid: {02-target-uuid: {"hp": "+1"}}}}}*/]; /* only literally the rn-being-resolved action/whatever here */
	pending_changes = [{/*modify: {uuid: {02-target-uuid: {"hp": "+1"}}}*/}];
	players = [];
	settings = {
		graze_timeout: 2000,
		main_step_timeout: 3000,
		/* disabled_cards: [], */
	};
	state = {
		public: {
			lobby: true,
			round: 0,
			turn: 0,
			step: 0
		},
		private: {
			hands: [[], [], [], []],
			decks: {
				main: { draw: [], discard: [] },
				incident: { draw: [], discard: [] },
			}
		}
	};
	constructor(io) {
		this.io = io;
		// this.const = [];
		// this.network = new Network(io);
		// this.network.on("q", () => {this.fn.q()});
		// console.log(this.network.listeners("q")[0].toString());
	}
	fn = {
		attack: async (attacker, victims) => {
			// timeout, pass, graze
			let p = new Promise((resolve, reject) => {
				let playlistener = (card) => {resolve(card)};
				for (let victim of victims){
					// listening for play event from any player
					this.players[victim].socket.once("play", playlistener);
				}
				setTimeout(() => {
					for (let victim of victims) {
						this.players[victim].socket.off("play", playlistener);
					}
					reject("timeout");
				}, this.settings.graze_timeout);
				// broadcast attack, now evone knows victims should do something
				this.io.emit("attack", attacker, victims);
			});
			let card = await p.catch((reason) => {
				console.log(reason);
				return false;
			});
			if (card !== undefined) {
				// play
				let cardobj = this.state.private.hands[this.state.public.turn].find((ele) => (ele.name.equals()));
				
			}
			

			for (let e of this.stock_effects) {
				
			}
		},
		net_prompt: async (event, data, awaited_event, awaited_senders, timeout) => {
			let ret;

			let s = withTimeout(new Semaphore(1), timeout);
			const on_socket = (data) => {
				ret = data;
				s.release()
			};
			await s.acquire();

			// listening for play event
			for (const p in awaited_senders) {
				p.socket.once(awaited_event, on_socket);
			}
			// "client x can  cards" > everyone
			this.io.emit(event, data);

			await s.acquire().catch((reason) => {
				console.log("event " + reason);
				// if (e === E_TIMEOUT) {
				// }
				ret = false;
			});
			return ret;
		},
		// net_await: async (event, senders, timeout) => {
		// 	let p = new Promise((resolve, reject) => {
		// 		let playlistener = (data) => {resolve(data)};
		// 		// listening for play event
		// 		for (const p in senders) {
		// 			p.socket.once(event, playlistener);
		// 		}
		// 		// timeout if no response
		// 		setTimeout(() => {
		// 			for (const p in senders) {
		// 				p.socket.off(event, playlistener);
		// 			}
		// 			reject("timeout");
		// 		}, timeout);
		// 	});
		// 	return await p.catch((reason) => {
		// 		console.log("event " + reason);
		// 		return false;
		// 		// card = false
		// 	});
		// },
		step: {
			setup: async () => {
				// for (let f in )
				/* Set Up Decks
				Shuffle the Main Deck cards together and place
				them in a pile where everyone can reach. Set aside
				an area next to the Main Deck for the discard pile.
				Shuffle the Incident cards together and place
				them in a pile next to the Main Deck cards
				*/

				// uuidv4();
			},
			assign_characters: async () => {
				/* Assign Characters
				Shuffle the Character cards together. Then, deal
				each player two Character cards, face down. Of the
				two available Character cards, each player chooses
				one to keep and one to discard. Players may look at
				their own Role card before choosing which
				character to use, but do not reveal either the Role
				card or Character card.
				*/

				// this.fn.
				// this.io.emit("assign_characters", );
			},
			start_of_turn: async () => {
				/* Start of Turn
				At the start of a player's turn, any effects for that
				player that last “until your next turn” end. Limits on
				how many DDanmaku cards and SSpell Cards
				a player can play reset at the start of their turn.
				*/
			},
			incident: async () => {
				/* Incident Step
				At the beginning of the incident step, if there is no
				Incident card in play, put the top card of the
				Incident deck into play.
				Whether or not a new Incident card was played this
				turn, the current player then performs any actions
				listed that take place during the Incident step.
				If the current Incident card is resolved during the
				incident step, do not play a new Incident card
				until the next player’s incident step. See
				Incident Cards for more information.
				*/
			},
			draw: async () => {
				/* Draw Step
				The current player draws for the turn. By default,
				players draw two cards per turn.
				*/
			},
			main: async () => {
				console.log(`${this.state.public.round}.${this.state.public.turn}.main`);
				/* Main Step
				Most interaction happens on the main step. Players
				can play AAction cards or put IItem cards into
				play only on their main step. */
				for (;;) {
					let played_card = await this.fn.net_prompt("action", this.players[this.state.public.turn], "play", [this.players[this.state.public.turn]], this.settings.main_step_timeout);
					// validate, apply the action and broadcast results
					console.log(played_card);
					if ( !played_card || played_card == "pass" || !("uuid" in played_card) || !("args" in played_card) ) {
						// pass
						break;
					}
					// if not has card xd
					if ( !this.state.private.hands[this.state.public.turn].includes(played_card.uuid) ) {
						// no card
						console.log("cheating " + played_card.uuid);
						break;
					}
					// check card play possibility
					let ret = this.uuid[played_card.uuid].fn("action", played_card.args, this);
					console.log("ret " + ret);
					if (ret === false) {
						console.log(this.uuid[played_card.uuid].name + " couldn't apply")
					}
					this.pending_history.push({
						event: "card played",
						player: this.players[this.state.public.turn].uuid,
						card: played_card.uuid,
						effect: ret
					});
					// card effect prepared
					// check stock effects
					for (let e of this.stock_effects) {
						let change = e.fn(this);
						this.pending_history.push({
							event: "stock effect",
							source: e.source.uuid,
							reason: played_card.uuid,
							effect: change
						});
					}

					let played_card = await this.fn.net_prompt("reaction", [this.players[this.state.public.turn], ], "play", [this.players[this.state.public.turn]], this.settings.main_step_timeout);
					// apply whats been created in pending_history
					
				}
				console.log("main step over");
				/* Card types can be
				identified by symbols on the sides of the card's rule
				text box. See Card Symbols for more information.
				There is no limit to the number of cards a player
				can play on their turn, with two exceptions:
				By default, players can only play one DDanmaku
				card per round. Danmaku cards include Shoot and
				Seal Away. Some cards increase the number of
				DDanmaku cards a player can play each round,
				such as Power and Stopwatch.
				Players can only ever activate one SSpell Card per
				round. This includes activating your own Spell
				Card, with cards like Bomb or Spiritual Attack,
				or another player’s Spell Card with Capture Spell
				Card. There are no effects that increase the
				number of SSpell Cards a player can activate
				in one round.
				The limits on DDanmaku cards and SSpell Cards
				are independent. Players can activate a SSpell Card
				in the same round they played a DDanmaku card
				and vice versa. Players can also use a Bomb’s effect
				to cancel a DDanmaku card or SSpell Card, even
				on a round they activated their SSpell Card. These
				limits last until the start of the player's next turn.
				*/
			},
			discard: () => {
				/* Discard Step
				During each player’s discard step, all players
				discard down to their max hand size. This is the
				only time players must discard due to max hand
				size. If a player draws above their max hand size,
				they do not need to discard down to their max hand
				size until the next discard step.
				After the discard step, play moves to the next active
				player on the left (going clockwise). That player
				takes the next turn.
				*/
			},
		},
	};

}



};

// game.fn.next = function(self) {
// 	if (self.state.public.round == 0 && self.state.public.turn == 0)
// 	{
// 		return game.fn.step.draw;
// 	}
// }

export default Game;