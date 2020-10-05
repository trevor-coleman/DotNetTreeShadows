namespace dotnet_tree_shadows.Models.InvitationModel {
  public class FriendRequest :AInvitation {

    public override InvitationType InvitationType {
      get => InvitationType.FriendRequest;
    }

  }
}
