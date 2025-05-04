import { Card } from "../lib.js";

const main = [
  new Card(
    "Shoot",
    "/shoot.png",
    (purpose, game)=>{
      if (purpose == "action") {

      }
      console.log(game);
    }
  ),
  new Card(
  /* Choose a player. That player gains 1 life. You cannot go above your max life.
  OR
  Play this when any player is reduced to 0 life.
  That player returns to 1 life.
  */
    "1Up",
    "/1up.png",
    (purpose, args, game)=>{
      let ret = {modify: {}};
      if (purpose == "action") {
        if (!args.target) {
          console.log("no args.target on 1up");
          return false;
        }
        // let target = game.uuid[args.target];
        ret.modify = {uuid: {}};
        ret.modify.uuid[args.target] = {"hp": "+1"};
        return ret;
      }
      if (purpose == "reaction") {
        
      }
    }
  ),
];
const incident = [];
const character = [];
const role = [];

export { main, incident, character, role };