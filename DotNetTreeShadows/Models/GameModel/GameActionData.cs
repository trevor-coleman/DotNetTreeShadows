using System;
using dotnet_tree_shadows.Services.GameActionService;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models.GameModel {
  [Serializable]
  public class GameActionData {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id = null!;
    public int? Origin;
    public int? Target;
    public string PlayerId = null!;
    public bool Discarded;
    
    [BsonRepresentation( BsonType.String )]
    public PieceType? PieceType;

    [BsonRepresentation( BsonType.String )]
    public GameActionType ActionType;

    public GameActionData () { }

    public GameActionData(string playerId, GameActionType actionType, int? origin, int? target, PieceType? pieceType) {
      Id = ObjectId.GenerateNewId().ToString();
      PlayerId = playerId;
      ActionType = actionType;
      PieceType = pieceType;
      Target = target;
      Origin = origin;
    }
    
    public GameActionData(string playerId, GameActionType actionType, int origin, PieceType pieceType, bool? discarded) {
      Id = ObjectId.GenerateNewId().ToString();
      PlayerId = playerId;
      ActionType = actionType;
      PieceType = pieceType;
      Target = null;
      Origin = origin;
      Discarded = discarded ?? false;
    }
public GameActionData(string playerId, GameActionType actionType, int origin, PieceType pieceType) {
      Id = ObjectId.GenerateNewId().ToString();
      PlayerId = playerId;
      ActionType = actionType;
      PieceType = pieceType;
      Target = null;
      Origin = origin;
      Discarded = false;
    }
    public GameActionData(string playerId, GameActionType actionType, PieceType pieceType) {
      Id = ObjectId.GenerateNewId().ToString();
      PlayerId = playerId;
      ActionType = actionType;
      PieceType = pieceType;
      Target = null;
      Origin = null;
    }
    public GameActionData(string playerId, GameActionType actionType, int origin, int target) {
      Id = ObjectId.GenerateNewId().ToString();
      PlayerId = playerId;
      ActionType = actionType;
      PieceType = null;
      Target = target;
      Origin = origin;
    }
  }
}
