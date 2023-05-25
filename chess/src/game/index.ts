import ChessBoard from "../chess-board";
import User from "../user";
import { Chess } from 'chess.js';

class Game{
  id: string
  users: User[] = []
  chessBoards: ChessBoard[] = []
  isStarted: boolean = false
  isCpu: boolean = false;
  constructor(id: string){
    this.id = id;
  }
  addUser = (user: User)=>{
    const alreadyIn = this.users.find((userInGame)=>userInGame.socketId===user.socketId);
    if(alreadyIn) return this;
    this.users.push(user);
    return this;
  }
  initChessBoards = (playersCount: number)=>{
    const boardsCount = playersCount/2;
    for(let i = 0; i < boardsCount; i++){
      this.chessBoards.push(new ChessBoard(`${this.id}.${i}`))
    }
    this.isStarted = true;
  }
  getPlayerColor = (socketId: string)=>{
    const userIndex = this.users.findIndex(userSocket=>userSocket.socketId === socketId) + 1
    if(userIndex === 0) return;
    const user = this.users[userIndex - 1];
    user.color = userIndex%2 === 0 ? 'black' : 'white'
    return user.color;
  }
  getFreeChessBoard = (socketId: string)=>{
    const user = this.users.find((user)=>user.socketId === socketId);
    if(!user) return;
    let clearChessBoards = this.chessBoards.filter((chessBoard)=>!chessBoard.wasUsers.has(user));
    if(clearChessBoards.length === 0){
      this.chessBoards.forEach((chessBoard)=>{
        chessBoard.removeUser(user);
      })
      clearChessBoards = this.chessBoards;
    }
    const chessBoard = clearChessBoards.find((chessBoard)=>!chessBoard.isBusy && !chessBoard.isEnd && chessBoard.curColor === user.color);
    if(!chessBoard) return;
    chessBoard.beBusy;
    chessBoard.addUser(user);
    return chessBoard;
  }
  moveOnChessBoard = (chessBoardId: string, fen: string)=>{
    const chessBoard = this.chessBoards.find((chesBoard)=>chesBoard.id===chessBoardId);
    if(!chessBoard) return;
    chessBoard.changeFen(fen);
    if(chessBoard.checkIsEnd()) return;
    chessBoard.beNotBusy();
    chessBoard.changeColor();
    if(this.isCpu){
      setTimeout(()=>{
        const chess = new Chess(fen);
        const moves = chess.moves()
        const move = moves[Math.floor(Math.random() * moves.length)];
        chess.move(move)
        chessBoard.changeFen(chess.fen());
        if(!chessBoard.checkIsEnd()) chessBoard.changeColor();
      }, 1000)
    }
  }
  isGameOver = ()=>{
    const chessBoardsActive = this.chessBoards.filter((chessBoard)=>!chessBoard.isEnd)
    return chessBoardsActive.length === 0;
  }
  whoWinned = ()=>{
    let white = 0;
    let black = 0;
    this.chessBoards.forEach((chessBoard)=>{
      if(chessBoard.curColor === 'white') white++;
      else black++;
    }, {})
    if(white > black) return 'white';
    if(black > white) return 'black';
    return 'draw';
  }
  excludeUser = (userSocketId: string)=>{
    this.users = this.users.filter(user=>user.socketId !== userSocketId);
  }
  isOneSided = ()=>{
    let white = 0;
    let black = 0;
    this.users.forEach((user)=>{
      if(user.color === 'white') white++;
      else black++;
    })
    if(white === 0 || black === 0) return true;
    return false;
  }
  initCpu = ()=>{
    let white = 0;
    let black = 0;
    this.users.forEach((user)=>{
      if(user.color === 'white') white++;
      else black++;
    })
    const side = white === 0 ? 'white' : 'balck';
    this.chessBoards.forEach((chessBoard)=>{
      if(chessBoard.curColor !== side) return;
      const chess = new Chess(chessBoard.fen);
      const moves = chess.moves()
      const move = moves[Math.floor(Math.random() * moves.length)]
      chess.move(move)
      chessBoard.changeFen(chess.fen());
      if(!chessBoard.checkIsEnd()) chessBoard.changeColor();
    })
    this.isCpu = true;
  }
}

export default Game;