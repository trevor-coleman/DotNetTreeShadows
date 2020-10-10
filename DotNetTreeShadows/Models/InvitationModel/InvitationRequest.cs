using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.InvitationModel {
  public class FriendRequestRequest {
    
    public string? Email { get; set; } = null;
    
    [BsonRepresentation( BsonType.String )]
    public InvitationType InvitationType { get; set; }

  }
  
  public class SessionInviteRequest {
    
    [BsonRepresentation( BsonType.ObjectId )]
    public string RecipientId { get; set; } = null;
    
    [BsonRepresentation( BsonType.ObjectId )]
    public string SessionId { get; set; } = null;
    
    [BsonRepresentation( BsonType.String )]
    public InvitationType InvitationType { get; set; }

  }

  public class ManySessionInviteRequest {
    
    [BsonRepresentation( BsonType.ObjectId )]
    public string[] RecipientIds { get; set; } = null;
    
    [BsonRepresentation( BsonType.ObjectId )]
    public string SessionId { get; set; } = null;
  }
}
