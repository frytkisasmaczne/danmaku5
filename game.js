'use strict'
import * as base from "./cards/base.js";
import randomUUID from 'node:crypto';

class Game {
	players = [];
	settings = {
		graze_timeout: 20,
		main_step_timeout: 30,
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
			hands: {},
			decks: {
				main: { draw: [], discard: [] },
				incident: { draw: [], discard: [] },
			}
		}
	};
	constructor(io) {
		this.io = io;
		this.const = [];
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
					reject();
				}, this.settings.graze_timeout);
				// broadcast attack, now evone knows victims should do something
				this.io.emit("attack", attacker, victims);
			});
			let card = await p.catch((reason) => {
				// timeout
				return false;
			});
			if (card !== undefined) {
				// play
				let cardobj = this.state.private.hands[this.state.public.turn].find((ele) => (ele.name.equals()));
				
			}
			

		},
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
				do {
					let p = new Promise((resolve, reject) => {
						let playlistener = (card) => {resolve(card)};
						// listening for play event
						this.players[this.state.public.turn].socket.once("play", playlistener);
						// timeout if no response
						setTimeout(() => {
								this.players[this.state.public.turn].socket.off("play", playlistener);
								reject();
							}, this.settings.main_step_timeout);
						// "client x can play action cards" > everyone
						this.io.emit("action", this.players[this.state.public.turn].socket.id);
					});
					let faceuuid = await p.catch((reason) => {
						return false;
					});
					if (faceuuid === false) {
						// timeout
						break;
					}
					// validate, apply the action and broadcast results
					if (faceuuid === undefined) {
						// pass
						break;
					}
					// play
					if (

						this.state.private.hands[this.state.public.turn]
						.map((cardobj) => {return cardobj.name;})
						.includes(faceuuid)
					) {
						// has card
						let faceobj = this.state.private.hands[this.state.public.turn].find((ele) => (ele.name.equals()));
						if (  ) {
							// card is action
							cardobj.fn.action(this); // nonononono call func and catch error after all i think
							// todo above fn can (will often) return that it wont execute after all because of failed additional checks at the beginning
						}
					}
				}
				while ( !(!card || card[0] == "pass") );
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