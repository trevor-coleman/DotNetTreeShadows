using System;
using dotnet_tree_shadows.Actions;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModel;

namespace dotnet_tree_shadows.Services.GameActionService {
  [Serializable]
  public class ActionContext {
    public GameActionType GameActionType { get; set; }
    public Game? Game { get; set; }
    public string SessionId { get; set; }
    public string PlayerId { get; set; }
    public string? TargetPlayerId { get; set; }
    public Hex? Origin { get; set; }
    public Hex? Target { get; set; }
    public Session? Session { get; set; }
    public UserModel? User { get; set; }
    public Board? Board { get; set; }
    public GameStatus[]? PermittedGameStatuses { get; set; }
    public int? Cost { get; set; }
    public PieceType? PieceType { get; set; }
    
    
  }
}
