namespace dotnet_tree_shadows.Models.InvitationModel {
  public class SessionInvite:AResourceInvitation {

    public override InvitationType InvitationType {
      get => InvitationType.SessionInvite;
    }
  }
}
