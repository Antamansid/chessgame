import User from '../user';
import { Chess } from 'chess.js';
import type {IChessBoard} from '../../../types/chess-portal';

class ChessBoard implements IChessBoard{
  id: string
  isBusy: boolean = false
  fen?: string
  curColor: 'white' | 'black' = 'white'
  wasUsers: Set<User> = new Set();
  isEnd: boolean = false;
  constructor(id: string){
    this.id = id;
  }
  addUser = (user: User)=>{
    this.wasUsers.add(user);
    return [...this.wasUsers.values()];
  }
  removeUser = (user: User)=>{
    this.wasUsers.delete(user);
    return [...this.wasUsers.values()];
  }
  beBusy = ()=>{
    return this.isBusy = true;
  }
  beNotBusy = ()=>{
    return this.isBusy = false;
  }
  changeFen = (fen: string)=>{
    return this.fen = fen;
  }
  changeColor = ()=>{
    this.curColor = this.curColor === 'black' ? 'white' : 'black';
    return this.curColor;
  }
  checkIsEnd = ()=>{
    const chess = new Chess(this.fen);
    this.isEnd = chess.isGameOver();
    return this.isEnd;
  }
}

export default ChessBoard;