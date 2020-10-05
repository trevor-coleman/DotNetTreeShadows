namespace dotnet_tree_shadows.Models.InvitationModel {
  public abstract class AResourceInvitation : AInvitation {
    public string ResourceId { get; set; }
    public string ResourceName { get; set; }
    
    public override bool IsDuplicate(AInvitation invitation) => invitation is AResourceInvitation i && i.SenderId == SenderId && i.RecipientId == RecipientId && i.InvitationType == InvitationType && i.ResourceId == ResourceId;    
    public override bool Involves (string id) => id == SenderId || id == RecipientId || id == ResourceId;
  }
}

