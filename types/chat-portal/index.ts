interface IJoinRoomMsg{
  name : string,
  roomId: string,
}
interface IUser{
  name: string,
  socketId: string
}
interface IRoomDto{
  name: string;
  id: string;
}
interface IChatMessage{
  nickname: string,
  msg: string,
  dateMsg: string
}
interface IStartGame{
  roomId: string,
  usersCount: number,
  playersCount: number
}
interface IRoomMsg{
  roomId: string,
  name: string
}
interface IFrontEvents{
  joinRoom: (props: IJoinRoomMsg)=>void
  chatMessage: (props: string) => void
  addNewRoom: (props: IRoomMsg) => void
  startGame: (props: IStartGame) => void
}
interface IBackEvents{
  roomUsers: (props: IUser[])=>void
  roomsList: (props: IRoomDto[])=>void
  roomName: (props: string)=>void
  message: (props: IChatMessage)=>void
  startGame: (props: IStartGame)=>void
}


export type {
  IJoinRoomMsg,
  IFrontEvents,
  IBackEvents,
  IUser,
  IRoomDto,
  IStartGame,
  IRoomMsg,
}