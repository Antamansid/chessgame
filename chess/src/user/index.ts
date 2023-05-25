import type {IUser} from '../../../types/chess-portal';

class User implements IUser{
  name: string
  socketId: string
  chessboardsWas: number[]
  color: 'black' | 'white' = 'white'
  constructor(name: string, socketId: string, chessboardsWas: number[]){
    this.name = name;
    this.socketId = socketId;
    this.chessboardsWas = chessboardsWas;
  }
}

export default User;