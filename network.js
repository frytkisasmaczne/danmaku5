'use strict'
import EventEmitter from 'events';

/** at some point i realized this is a 1:1 wrapper
 * over the basics of a socket.io Server.  
 * the only difference being a queue
 * but the queue is important, the order of packet arrival is important
 */
class Network extends EventEmitter{
  q = [];
  constructor(io) {
    super();
    this.io = io;
    io.on('connection', (socket)=>{this.on_any("connection", socket);});
  };
  // async on_promise(events) {
  //   let p = new Promise((resolve, reject)=>{
  //     for (e of events)
  //     {
  //       this.on(e, resolve()
  //     }  
  //   });
  //   let fn = ()=>{};
    
    
  //   // return new Promise((resolve, reject) => {
      
  //   // });
  //   return 0;
  // };
  
  connection(socket) {
    let e = ["connection", socket];
    this.q.push(e);
    this.emit("connection", socket);
  };
  async accept(socket) {
    socket.onAny((event, ...args)=>{this.on_any(socket, event, ...args);});
  };
  async disconnect(socket) {
    socket.disconnect();
  };
  on_any(socket, event, ...args) {
    if (this.listeners(event))
    {
      let e = [event, socket, args];
      this.q.push(e);
      this.emit(event, e);
    }
    else
    {
      console.log(`skipped no listeners ${event}, ${args}`);
    }
  };
}

export default Network;