import formatMessage from "../../helper/format-message";
import Rooms from "../../rooms/rooms";
import User from "../../user";
import { Server, Socket } from "socket.io";
import type {IBackEvents, IFrontEvents, IJoinRoomMsg, IStartGame} from '../../../../types/chat-portal';

type TSocket = Socket<IFrontEvents, IBackEvents>;
type TServer = Server<IFrontEvents, IBackEvents>

class ChatPortalService{
  io: TServer
  rooms: Rooms 
  constructor(io: Server){
    this.io = io;
    this.rooms = new Rooms();
  }
  onJoinRoom = (socket: TSocket, {name, roomId}: IJoinRoomMsg)=>{
    const user = new User(name, socket.id)
    socket.join(roomId);
    const room = this.rooms.getRoomById(roomId) ?? this.rooms.addRoom(roomId, name);
    room.joinUser(user);
    this.io.to(roomId).emit('roomUsers', room.users);
    if(roomId === 'main'){
      const rooms = this.rooms.getRoomsList();
      const filteredRooms = rooms.filter(room=>room.id !== 'main')
      socket.emit('roomsList', filteredRooms);
    }
    socket.emit('roomName', room.name);
  }
  onChatMessage = (socket: TSocket, msg: string)=>{
    const room = this.rooms.getRoomBySocketId(socket.id);
    if(!room) return;
    const user = room.users.find(user=>user.socketId === socket.id);
    if(!user) return;
    this.io.to(room.id).emit('message', formatMessage(user.name, msg));
  }
  onAddNewRoom = (roomId: string, name: string)=>{
    this.rooms.addRoom(roomId, name);
    const rooms = this.rooms.getRoomsList();
    const filteredRooms = rooms.filter(room=>room.id !== 'main');
    this.io.to('main').emit('roomsList', filteredRooms);
  }
  onStartGame = (socket: TSocket, props: IStartGame) => {
    const room = this.rooms.getRoomBySocketId(socket.id);
    if(!room) return;
    this.io.to(room.id).emit('startGame', props);
  }
  onDisconnect = (socket: TSocket) => {
    const room = this.rooms.getRoomBySocketId(socket.id);
    if(!room) return;
    room.exitUser(new User('', socket.id));
    this.io.to(room.id).emit('roomUsers', room.users);
  }
}

export default ChatPortalService;
export type {TServer, TSocket};