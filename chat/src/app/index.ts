import http from 'http';
import express from 'express';
import {Server} from 'socket.io';

interface IAppConfig{
  corsOrigin?: string,
}
interface IAppConstructor{
  new (io: Server): IAppController;
}
interface IAppController{}

class App{
  private io: Server
  private server: http.Server
  private controller?: IAppController
  constructor(config: IAppConfig){
    const app = express();
    this.server = http.createServer(app);
    this.io = new Server(this.server, {
      cors: {
        origin: config.corsOrigin || '*'
      }
    });
  }
  listen = (port?: number)=>{
    this.server.listen(port || 3002, () => console.log(`Chat server running on port ${port || 3002}`));
  }
  initController = (controller: IAppConstructor)=>{
    this.controller = new controller(this.io);
  }
}
export default App;
export type {
  IAppConfig,
  IAppController,
}