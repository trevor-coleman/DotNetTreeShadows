using System;

namespace dotnet_tree_shadows.Models {
    public class Invitation {
        public string SenderId { get; set; }
        public string ResourceId { get; set; }
        public DateTime? Created { get; set; }
        public InvitationStatus? Status { get; set; }
        public string? StatusMessage { get; set; }
        public InvitationType InvitationType { get; set; }

        public Invitation (string senderId, string recipientId, DateTime created, InvitationStatus status, string statusMessage) {
            SenderId = senderId;
            RecipientId = recipientId ;
            ResourceId = null;
            Created = created;
            Status = status;
            StatusMessage = statusMessage;
        }
        
        public Invitation (string senderId, string recipientId, string resourceId, DateTime created, InvitationStatus status, string statusMessage) {
            SenderId = senderId;
            RecipientId = recipientId ;
            ResourceId = resourceId;
            Created = created;
            Status = status;
            StatusMessage = statusMessage;
        }

        public Invitation () {
            SenderId = "";
            RecipientId = "";
            ResourceId = null;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Accepted;
            InvitationType = InvitationType.FriendRequest;
            StatusMessage = "";

        }
        
        public Invitation (string senderId, string recipientId, string resourceId, InvitationType invitationType) {
            SenderId = senderId;
            RecipientId = recipientId;
            ResourceId = resourceId;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Pending;
            StatusMessage = null;
            InvitationType = invitationType;
        }
        
        public Invitation (string senderId, string recipientId, InvitationType invitationType) {
            SenderId = senderId;
            RecipientId = recipientId;
            ResourceId = null;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Pending;
            StatusMessage = null;
            InvitationType = invitationType;
        }

        public Invitation (Invitation invitation) {
            SenderId = invitation.SenderId;
            RecipientId = invitation.SenderId;
            ResourceId = invitation.ResourceId;
            Created = invitation.Created;
            Status = invitation.Status;
            StatusMessage = invitation.StatusMessage;
            InvitationType = invitation.InvitationType;

        }

        public static Invitation Accept (Invitation invitation) =>
            new Invitation( invitation ) {
                                             Status = InvitationStatus.Accepted,
                                             StatusMessage = $"Accepted on {DateTime.Today}"
                                         };

        
        public static Invitation Decline (Invitation invitation, string reason) =>
            new Invitation( invitation ) {
                                             Status = InvitationStatus.Declined,
                                             StatusMessage = $"{reason} - {DateTime.Today}"
                                         };

        public bool IsDuplicate (Invitation i) => i.SenderId == SenderId && i.RecipientId == RecipientId && i.InvitationType == InvitationType;

        public bool IsInverse (Invitation i) =>
            i.SenderId == RecipientId && i.RecipientId == SenderId && i.InvitationType == InvitationType;

    }

    public enum InvitationType {
        ToSession,
        FriendRequest
    }
    
    

}
