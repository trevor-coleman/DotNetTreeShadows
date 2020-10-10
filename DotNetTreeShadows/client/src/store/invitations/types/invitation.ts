export interface Invitation {
    id: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    recipientName: string;
    resourceId: string;
    resourceName: string;
    invitationType: InvitationType;
    created: string;
    status: InvitationStatus;
}

export type InvitationStatus = "Accepted" | "Declined" | "Cancelled" | "Pending";
export type InvitationType = "FriendRequest" | "SessionInvite";
