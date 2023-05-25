import { IAppController } from "../../app";
import ChatPortalService, {TServer, TSocket} from "../service";
import type {IJoinRoomMsg, IRoomMsg, IStartGame} from '../../../../types/chat-portal';

class ChatPortalController implements IAppController{
  io: TServer
  service: ChatPortalService
  constructor(io: TServer){
    this.io = io;
    this.service = new ChatPortalService(this.io);
    this.io.on('connection', socket => {
      socket.on('joinRoom', this.onJoinRoom(socket));
      socket.on('chatMessage', this.onChatMessage(socket));
      socket.on('addNewRoom', this.onAddNewRoom(socket));
      socket.on('startGame', this.onStartGame(socket));
      socket.on('disconnect', this.onDisconnect(socket));
    });
  }
  onJoinRoom = (socket: TSocket)=>{
    return (props: IJoinRoomMsg)=>{
      this.service.onJoinRoom(socket, props);
    }
  }
  onChatMessage = (socket: TSocket)=>{
    return (props: string)=>{
      this.service.onChatMessage(socket, props);
    }
  }
  onAddNewRoom = (socket: TSocket)=>{
    return ({roomId, name}: IRoomMsg)=>{
      this.service.onAddNewRoom(roomId, name)
    }
  }
  onStartGame = (socket: TSocket)=>{
    return (props: IStartGame) => {
      this.service.onStartGame(socket, props);
    }
  }
  onDisconnect = (socket: TSocket)=>{
    return () => {
      this.service.onDisconnect(socket);
    }
  }

}

export default ChatPortalController;