using System;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_tree_shadows.Models {
    public class Invitation {
        public string SenderId { get; set; }
        public string ResourceId { get; set; }
        public DateTime? Created { get; set; }
        public InvitationStatus? Status { get; set; }
        public string? StatusMessage { get; set; }
        public InvitationType InvitationType { get; set; }

        public Invitation (string senderId, string resourceId, DateTime created, InvitationStatus status, string statusMessage) {
            SenderId = senderId;
            ResourceId = resourceId;
            Created = created;
            Status = status;
            StatusMessage = statusMessage;
        }

        public Invitation () {
            SenderId = "";
            ResourceId = "";
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Accepted;
            InvitationType = InvitationType.FriendRequest;
            StatusMessage = "";

        }
        
        public Invitation (string senderId, string resourceId, InvitationType invitationType) {
            SenderId = senderId;
            ResourceId = resourceId;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Pending;
            StatusMessage = null;
            InvitationType = invitationType;
        }

        public Invitation (Invitation invitation) {
            SenderId = invitation.SenderId;
            ResourceId = invitation.SenderId;
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

        public bool IsDuplicate (Invitation i) => i.SenderId == SenderId && i.ResourceId == ResourceId && i.InvitationType == InvitationType;

        public bool IsInverse (Invitation i) =>
            i.SenderId == ResourceId && i.ResourceId == SenderId && i.InvitationType == InvitationType;

    }

    public enum InvitationType {
        Session,
        FriendRequest
    }
    
    

}
