import type {IUser} from '../../../types/chat-portal';

class User implements IUser{
  name: string
  socketId: string
  constructor(name: string, socketId: string){
    this.name = name;
    this.socketId = socketId;
  }
}

export default User;