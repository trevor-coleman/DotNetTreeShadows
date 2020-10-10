import {SessionSummary} from "../reducer";
import {FriendProfile} from "./friendProfile";

export interface Profile {
    id: string,
    name: string,
    email: string,
    sessions: SessionSummary[],
    friends: FriendProfile[],
    receivedInvitations: string []
    sentInvitations: string[]
}
