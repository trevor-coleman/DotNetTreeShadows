export type Session = {
    id:string,
    name: string,
    host: string,
    invitations: string[],
    players: {[player: string]: {
        name: string
        }},
}
