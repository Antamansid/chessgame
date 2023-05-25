import type { IAppController } from '../../app';
import ChessPortalService, {IJoinGameMsg, IMoveProps, TServer, TSocket} from '../service';

class ChessPortalController implements IAppController{
  io: TServer
  service: ChessPortalService
  constructor(io: TServer){
    this.io = io;
    this.service = new ChessPortalService(this.io)
    this.io.on('connection', socket=>{
      socket.emit('joined')
      socket.on('joinGame', this.onJoinGame(socket));
      socket.on('startGame', this.onStartGame(socket))
      socket.on('freeChessBoard', this.onFreeChessBoard(socket))
      socket.on('move', this.onMove(socket))
      socket.on('whoWinned', this.onWhoWinned(socket))
      socket.on('disconnect', this.onDisconnect(socket))
    })
  }
  onDisconnect = (socket: TSocket)=>{
    return ()=>{
      this.service.onLeave(socket);
    }
  }
  onJoinGame = (socket: TSocket)=>{
    return (props: IJoinGameMsg)=>{
      this.service.onJoinGame(socket, props);
    }
  }
  onStartGame = (socket: TSocket)=>{
    return (gameId: string)=>{
      this.service.onStartGame(socket, gameId);
    }
  }
  onFreeChessBoard = (socket: TSocket)=>{
    return (gameId: string)=>{
      this.service.onFreeChessBoard(socket, gameId);
    }
  }
  onMove = (socket: TSocket)=>{
    return (props: IMoveProps)=>{
      this.service.onMove(socket, props);
    }
  }
  onWhoWinned = (socket: TSocket)=>{
    return ()=>{
      this.service.whoWinned(socket);
    }
  }
}
export default ChessPortalController;