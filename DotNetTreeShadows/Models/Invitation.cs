using System;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models {
    public class Invitation {
        [BsonId]
        [BsonRepresentation( BsonType.ObjectId )]
        public string Id { get; set; } = "";

        public string SenderId { get; set; } = "";
        public string SenderName { get; set; } = "";
        public string RecipientId { get; set; } = "";
        public string RecipientName { get; set; } = "";
        public string? ResourceId { get; set; } = "";
        public string? ResourceName { get; set; } = "";
        public DateTime? Created { get; set; } = DateTime.UtcNow;

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public InvitationStatus? Status { get; set; } = InvitationStatus.Pending;

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public InvitationType InvitationType { get; set; } = InvitationType.FriendRequest;

        public Invitation () { }
        

        public static Invitation FriendRequest (Profile sender, Profile recipient) =>
            new Invitation {
                               SenderId = sender.Id, 
                               RecipientId = recipient.Id, 
                               SenderName = sender.Name, 
                               RecipientName = recipient.Name, 
                               InvitationType = InvitationType.FriendRequest,
                               Created = DateTime.UtcNow,
                               Status = InvitationStatus.Pending,
                               ResourceId = null,
                           };


        public static Invitation SessionInvitation (Profile sender, Profile recipient, Session session) => new Invitation {
            SenderId = sender.Id, 
            RecipientId = recipient.Id, 
            SenderName = sender.Name, 
            RecipientName = recipient.Name, 
            InvitationType = InvitationType.FriendRequest,
            Created = DateTime.UtcNow,
            Status = InvitationStatus.Pending,
            ResourceId = session.Id,
        };

        protected Invitation (Invitation invitation) {
            SenderName = invitation.SenderName;
            RecipientName = invitation.RecipientName;
            Id = invitation.Id;
            SenderId = invitation.SenderId;
            RecipientId = invitation.RecipientId;
            ResourceId = invitation.ResourceId;
            Created = invitation.Created;
            Status = invitation.Status;
            InvitationType = invitation.InvitationType;
        }

        public static Invitation Accepted (Invitation invitation) =>
            new Invitation( invitation ) { Status = InvitationStatus.Accepted, };

        public static Invitation Declined (Invitation invitation) =>
            new Invitation( invitation ) { Status = InvitationStatus.Declined };

        public static Invitation Cancelled (Invitation invitation) =>
            new Invitation( invitation ) { Status = InvitationStatus.Cancelled };

        public bool IsDuplicate (Invitation i) =>
            i.SenderId == SenderId && i.RecipientId == RecipientId && i.InvitationType == InvitationType;

        public bool Involves (string id) => id == SenderId || id == RecipientId || id == ResourceId;
    }

    [JsonConverter( typeof( StringEnumConverter ) )]
    public enum InvitationType {
        SessionInvite,
        FriendRequest
    }

    [JsonConverter( typeof( StringEnumConverter ) )]
    public enum InvitationStatus {
        Pending,
        Accepted,
        Declined,
        Cancelled,
    }

}
