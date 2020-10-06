export interface Invitation {
    id: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    recipientName: string;
    resourceId: string;
    invitationType: InvitationType;
    created: string;
    invitationStatus: InvitationStatus
}

export type InvitationStatus = "Accepted" | "Declined" | "Cancelled" | "Pending";
export type InvitationType = "FriendRequest" | "SessionInvite";
