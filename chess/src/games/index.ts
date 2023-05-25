import Game from "../game";

class Games {
  list: Game[] = []
  constructor(){}
  getGameById = (id: string)=>{
    return this.list.find((game)=>game.id === id);
  }
  addGame = (id: string)=>{
    const game = new Game(id);
    this.list.push(game);
    return game;
  }
  getGameBySocketId = (id: string)=>{
    return this.list.find((game)=>!!game.users.find((user)=>user.socketId === id))
  }
  removeGame = (game: Game)=>{
    this.list = this.list.filter(ex=>ex !== game);
  }
}

export default Games;