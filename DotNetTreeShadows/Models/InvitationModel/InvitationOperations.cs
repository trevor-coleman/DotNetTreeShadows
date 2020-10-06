namespace dotnet_tree_shadows.Models.InvitationModel {
  public static class InvitationOperations {

    public static Invitation Decline (Invitation invitation) {
      invitation.Status = InvitationStatus.Declined;
      return invitation;
    } 

    public static Invitation Cancel (Invitation invitation) {
      invitation.Status = InvitationStatus.Cancelled;
      return invitation;
    }
    
    public static Invitation Accept (Invitation invitation) {
      invitation.Status = InvitationStatus.Accepted;
      return invitation;
    }
    


  }
}
