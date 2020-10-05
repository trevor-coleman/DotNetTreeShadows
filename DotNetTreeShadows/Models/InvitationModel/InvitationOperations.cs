namespace dotnet_tree_shadows.Models.InvitationModel {
  public class InvitationOperations {

    public static AInvitation Decline (AInvitation invitation) {
      invitation.Status = InvitationStatus.Declined;
      return invitation;
    } 

    public static AInvitation Cancel (AInvitation invitation) {
      invitation.Status = InvitationStatus.Cancelled;
      return invitation;
    }
    
    public static AInvitation Accept (AInvitation invitation) {
      invitation.Status = InvitationStatus.Accepted;
      return invitation;
    }
    


  }
}
