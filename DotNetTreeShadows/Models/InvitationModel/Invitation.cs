using System;
using dotnet_tree_shadows.Models.Enums;
using Mongo.Migration.Documents;
using Mongo.Migration.Documents.Attributes;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
// ReSharper disable MemberCanBeProtected.Global

namespace dotnet_tree_shadows.Models.InvitationModel {
  [RuntimeVersion("0.0.1")]
  public class Invitation: IDocument {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string SenderId { get; set; } = "";

    public string SenderName { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string RecipientId { get; set; } = "";

    public string RecipientName { get; set; } = "";

    [BsonRepresentation( BsonType.ObjectId )]
    public string? ResourceId { get; set; } = null;

    public string? ResourceName { get; set; } = null;
    
    public DateTime? Created { get; set; } = DateTime.UtcNow;
    public DateTime? Resolved { get; set; } = null;

    [BsonRepresentation( BsonType.String )]
    public InvitationStatus? Status { get; set; } = InvitationStatus.Pending;

    [BsonRepresentation( BsonType.String )]
    public virtual InvitationType InvitationType { get; set; }

    public virtual bool IsDuplicate (Invitation i) =>
      i.SenderId == SenderId && i.RecipientId == RecipientId && i.InvitationType == InvitationType;

    public virtual bool Involves (string id) => id == SenderId || id == RecipientId;

    public DocumentVersion Version { get; set; }

  }
}
