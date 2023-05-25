import Room from '../room';

class Rooms {
  list: Room[] = [new Room('main', 'Главная')]
  constructor(){}
  getRoomById = (roomId: string)=>{
    return this.list.find(room=>room.id===roomId);
  }
  getRoomBySocketId = (socketId: string)=>{
    return this.list.find((room)=>{
      return !!room.users.find(user=>user.socketId===socketId)
    })
  }
  getRoomsList = ()=>{
    return this.list.map((room)=>{
      return {name: room.name, id: room.id}
    })
  }
  addRoom = (id: string, name: string)=>{
    const newRoom = new Room(id, name);
    this.list.push(newRoom);
    return newRoom;
  }
}

export default Rooms;