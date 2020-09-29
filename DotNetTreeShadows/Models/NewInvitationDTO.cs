using System;
using System.ComponentModel.DataAnnotations;

// ReSharper disable FieldCanBeMadeReadOnly.Global

namespace dotnet_tree_shadows.Models {
    
    
    public class InvitationResponseDto {
        public InvitationResponseDto (Invitation invitation) 
        {
            SenderName = invitation.SenderName;
            SenderId = invitation.SenderId;
            RecipientName = invitation.RecipientName;
            RecipientId = invitation.RecipientId;
            ResourceId = invitation.ResourceId;
            ResourceName = invitation.ResourceName;
            Created = invitation.Created;
            InvitationType = invitation.InvitationType;
        }

        public InvitationType InvitationType { get; set; }
        public DateTime? Created { get; set; }

        public string? ResourceName { get; set; }

        public string? ResourceId { get; set; }

        public string RecipientId { get; set; }

        public string SenderId { get; set; }

        public string SenderName { get; set; }
        public string RecipientName { get; set; }

    }
    
    public class NewInvitationDto {
        
        public InvitationType InvitationType { get; set; }
        
        [EmailAddress]
        public string? Email = null;
        public string? RecipientId = null;
        public string? SessionId = null;
    }
}
