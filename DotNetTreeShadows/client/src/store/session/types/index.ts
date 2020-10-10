import Game from "../../game/types/game";
import {Board} from "../../board/types/board";

export type Session = {
    id:string,
    name: string,
    host: string,
    invitations: string[],
    invitedPlayers: string[],
    players: {[player: string]: {
        name: string
        }},
}


export type SessionUpdate = {
    session:Session,
    game: Game,
    board: Board
}
