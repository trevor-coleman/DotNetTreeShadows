namespace dotnet_tree_shadows.Models.InvitationModel {
  public class SessionInvite:Invitation {
    public override InvitationType InvitationType {
      get => InvitationType.SessionInvite;
    }
  }
}
