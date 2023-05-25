import User from '../../user';
import {Server, Socket} from 'socket.io';
import Games from '../../games';
import {IJoinGameMsg, IMoveProps, IBackEvents, IFrontEvents} from '../../../../types/chess-portal'

interface IPromiseQueue{
  promise: Promise<void>,
  resolve: (value: void | PromiseLike<void>) => void,
  socketId: string,
}
type TSocket = Socket<IFrontEvents, IBackEvents>
type TServer = Server<IFrontEvents, IBackEvents>

class ChessPortalService{
  io: TServer
  promiseQueue: IPromiseQueue[] = []
  games: Games
  constructor(io: TServer){
    this.io = io;
    this.games = new Games();
  }
  onLeave = (socket: TSocket)=>{
    const game = this.games.getGameBySocketId(socket.id);
    if(!game) return;
    game.excludeUser(socket.id);
    if(game.users.length === 0){
      return this.games.removeGame(game);
    }
    if(game.isOneSided()){
      game.initCpu();
    }
  }
  onJoinGame = (socket: TSocket, props: IJoinGameMsg)=>{
    const user = new User(props.userName, socket.id, []);
    const game = this.games.getGameById(props.gameId) ?? this.games.addGame(props.gameId);
    if(game.isStarted) return socket.emit('gameAlreadyStarted');
    socket.join(props.gameId);
    game.addUser(user);
    if(game.users.length !== props.usersCount){
      this.io.to(props.gameId).emit('roomUsersCount', {
        shouldBe: props.usersCount,
        connected: game.users.length
      });
      return;
    }
    game.initChessBoards(props.playersCount);
    this.io.to(props.gameId).emit('startGame', {
      shouldBe: props.playersCount,
      connected: game.users.length
    });
  }
  onStartGame = (socket: TSocket, gameId: string)=>{
    const game = this.games.getGameById(gameId);
    if(!game) return;
    const color = game.getPlayerColor(socket.id);
    if(!color) return;
    socket.emit('color', color);
    if(game.isOneSided()){
      game.initCpu();
    }
    const freeChessBoard = game.getFreeChessBoard(socket.id);
    socket.emit('freeChessBoard', freeChessBoard);
  }
  onFreeChessBoard = (socket: TSocket, gameId: string)=>{
    const game = this.games.getGameById(gameId);
    if(!game) return;
    if(game.isGameOver()){
      this.io.to(gameId).emit('gameEnd', game.whoWinned());
      return;
    }
    const freeChessBoard = game.getFreeChessBoard(socket.id);
    socket.emit('freeChessBoard', freeChessBoard);
  }
  onMove = (socket: TSocket, props: IMoveProps)=>{
    const {
      chessBoardId,
      fen,
      gameId,
    } = props;
    const game = this.games.getGameById(gameId);
    if(!game) return;
    game.moveOnChessBoard(chessBoardId, fen);
    const curPromiseIndex = this.promiseQueue.findIndex((prom)=>prom.socketId === socket.id);
    if(curPromiseIndex !== -1){
      const curPromise = this.promiseQueue[curPromiseIndex];
      curPromise.resolve();
      this.promiseQueue.splice(curPromiseIndex, 1);
    }
    const freeChessBoard = game.getFreeChessBoard(socket.id);
    socket.emit('freeChessBoard', freeChessBoard);
  }
  whoWinned = (socket: TSocket)=>{
    const game = this.games.getGameBySocketId(socket.id);
    if(!game) return;
    socket.emit('whoWinned', game.whoWinned());
  }
}
export default ChessPortalService;
export type {
  IJoinGameMsg,
  IMoveProps,
  TSocket,
  TServer
}