using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models {
    public class Invitation {
        [BsonId]
        [BsonRepresentation( BsonType.ObjectId )]
        public string Id;

        public string SenderId { get; set; }
        public string RecipientId { get; set; }
        public string? ResourceId { get; set; }
        public DateTime? Created { get; set; }

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public InvitationStatus? Status { get; set; }

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public InvitationType InvitationType { get; set; }

        public Invitation (string senderId, string recipientId, DateTime created, InvitationStatus status) {
            SenderId = senderId;
            RecipientId = recipientId;
            ResourceId = null;
            Created = created;
            Status = status;
        }

        public Invitation (
                string senderId,
                string recipientId,
                string resourceId,
                DateTime created,
                InvitationStatus status
            ) {
            SenderId = senderId;
            RecipientId = recipientId;
            ResourceId = resourceId;
            Created = created;
            Status = status;
        }

        public Invitation () {
            SenderId = "";
            RecipientId = "";
            ResourceId = null;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Accepted;
            InvitationType = InvitationType.FriendRequest;
        }

        public Invitation (string senderId, string recipientId, string resourceId, InvitationType invitationType) {
            SenderId = senderId;
            RecipientId = recipientId;
            ResourceId = resourceId;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Pending;
            InvitationType = invitationType;
        }

        public Invitation (string senderId, string recipientId, InvitationType invitationType) {
            SenderId = senderId;
            RecipientId = recipientId;
            ResourceId = null;
            Created = DateTime.UtcNow;
            Status = InvitationStatus.Pending;
            InvitationType = invitationType;
        }

        public static Invitation FriendRequest (string senderId, string recipientId) =>
            new Invitation( senderId, recipientId, InvitationType.FriendRequest );

        public static Invitation SessionInvitation (string senderId, string recipientId, string sessionId) =>
            new Invitation( senderId, recipientId, sessionId, InvitationType.SessionInvite );

        public Invitation (Invitation invitation) {
            Id = invitation.Id;
            SenderId = invitation.SenderId;
            RecipientId = invitation.SenderId;
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
