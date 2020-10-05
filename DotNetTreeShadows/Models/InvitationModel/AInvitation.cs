using System;
using System.Runtime.CompilerServices;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
// ReSharper disable MemberCanBeProtected.Global

namespace dotnet_tree_shadows.Models.InvitationModel {
  public abstract class AInvitation {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string SenderId { get; set; } = "";

    public string SenderName { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string RecipientId { get; set; } = "";

    public string RecipientName { get; set; } = "";

    public DateTime? Created { get; set; } = DateTime.UtcNow;
    public DateTime? Resolved { get; set; } = null;

    [BsonRepresentation( BsonType.String )]
    public InvitationStatus? Status { get; set; } = InvitationStatus.Pending;

    [BsonRepresentation( BsonType.String )]
    public abstract InvitationType InvitationType { get; }

    public virtual bool IsDuplicate (AInvitation i) =>
      i.SenderId == SenderId && i.RecipientId == RecipientId && i.InvitationType == InvitationType;

    public virtual bool Involves (string id) => id == SenderId || id == RecipientId;

  }
}
