interface IJoinGameMsg{
  userName : string,
  gameId: string,
  usersCount: number,
  playersCount: number,
}
interface IMoveProps{
  fen: string,
  chessBoardId: string,
  gameId: string
}
type TColor = 'white' | 'black'
interface IPlayersWaiting{
  shouldBe: number,
  connected: number
}
interface IUser{
  name: string
  socketId: string
  chessboardsWas: number[]
  color: TColor
}
interface IChessBoard{
  id: string
  isBusy: boolean
  fen?: string
  curColor: TColor
  wasUsers: Set<IUser>;
  isEnd: boolean;
}
interface IFrontEvents{
  joinGame: (props: IJoinGameMsg)=>void
  startGame: (props: string)=>void
  freeChessBoard: (props: string)=>void
  move: (props: IMoveProps)=>void
  whoWinned: ()=>void
}
interface IBackEvents{
  joined: ()=>void
  gameAlreadyStarted: ()=>void
  roomUsersCount: (props: IPlayersWaiting)=>void
  startGame: (props: IPlayersWaiting)=>void
  color: (props: TColor)=>void
  freeChessBoard: (props: IChessBoard | undefined)=>void
  gameEnd: (props: TColor | 'draw')=>void
  whoWinned: (props: TColor | 'draw')=>void
}

export type {
  IJoinGameMsg,
  IMoveProps,
  IFrontEvents,
  IBackEvents,
  IChessBoard,
  IUser,
  TColor,
  IPlayersWaiting,
}