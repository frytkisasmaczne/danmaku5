import { Card } from "../lib.js";

const main = [
  new Card(
    "Shoot",
    "/shoot.png",
    {
      action: (game)=>{
        console.log(game);
      }
    }
  ),
];
const incident = [];
const character = [];
const role = [];

export { main, incident, character, role };