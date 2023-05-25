import User from "../user";

class Room{
  name: string
  id: string
  users: User[] = []
  constructor(id: string, name: string){
    this.id = id;
    this.name = name;
  }
  joinUser = (user: User)=>{
    const userIndex = this.users.findIndex((userRoom)=>userRoom.socketId === user.socketId);
    if(userIndex !== -1) return userIndex;
    return this.users.push(user);
  }
  exitUser = (user: User)=>{
    const userIndex = this.users.findIndex((userRoom)=>userRoom.socketId === user.socketId);
    if(userIndex === -1) return;
    this.users.splice(userIndex, 1);
    return;
  }
}

export default Room;