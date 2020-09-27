using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
// ReSharper disable FieldCanBeMadeReadOnly.Global

namespace dotnet_tree_shadows.Models {
    
    
    public class InvitationResponseDTO {
        public InvitationResponseDTO (Invitation invitation) 
        {
            SenderName = invitation.SenderName;
            SenderId = invitation.Id;
            RecipientName = invitation.RecipientName;
            RecipientId = invitation.ResourceId;
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
    
    public class NewInvitationDTO {
        
        public InvitationType InvitationType { get; set; }
        
        [EmailAddress]
        public string? Email = null;
        public string? RecipientId = null;
        public string? SessionId = null;
    }
}
