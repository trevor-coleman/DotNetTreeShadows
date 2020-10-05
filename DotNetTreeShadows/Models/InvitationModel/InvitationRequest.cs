using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.InvitationModel {
  public class InvitationRequest {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    public string? Email { get; set; } = null;

    [BsonRepresentation( BsonType.ObjectId )]
    public string? SenderId { get; set; } = null;

    public string? SenderName { get; set; } = null;

    [BsonRepresentation( BsonType.ObjectId )]
    public string? RecipientId { get; set; } = null;

    public string? RecipientName { get; set; } = null;

    [BsonRepresentation( BsonType.ObjectId )]
    public string? ResourceId { get; set; } = null;

    public string? ResourceName { get; set; } = null;

    [BsonRepresentation( BsonType.String )]
    public InvitationStatus? Status { get; set; } = null;

    [BsonRepresentation( BsonType.String )]
    public InvitationType InvitationType { get; set; }

  }
}
