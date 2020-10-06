namespace dotnet_tree_shadows.Models.InvitationModel {
  public class FriendRequest :Invitation {

    public override InvitationType InvitationType {
      get => InvitationType.FriendRequest;
    }

  }
}
