using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618

namespace dotnet_tree_shadows.Models.Authentication {
  public class CheckForDuplicatesModel {
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; }
  }
}
