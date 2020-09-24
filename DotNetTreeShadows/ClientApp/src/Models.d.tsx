export interface ISignInCredentials {id:string, password:string}


type InvitationType = "FriendRequest" | "SessionInvite";
type InvitationStatus = "Pending" | "Accepted" | "Declined" | "Cancelled";

interface Invitation
{
  senderId: string;
  recipientId: string;
  resourceId: string;
  invitationType: InvitationType;
  created: Date;
  status: InvitationStatus
}


export type User = {
  id: string;
  name: string;
  sessions: Array<string>;
  sentInvitations: Array<string>;
  receivedInvitations: Array<string>;
  friends: Array<Friend>;
}

export type Friend = {
  id:string;
  name:string;
}

