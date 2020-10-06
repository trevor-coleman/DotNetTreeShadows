import {SessionSummary} from "./reducer";

export interface Profile {
    id: string,
    name: string,
    email: string,
    sessions: SessionSummary[],
    friends: string[],
    receivedInvitations: string []
    sentInvitations: string[]
}
