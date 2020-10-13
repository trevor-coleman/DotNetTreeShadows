using System.ComponentModel.DataAnnotations;
#pragma warning disable 8618

namespace dotnet_tree_shadows.Authentication {
    public class RegisterModel {
        
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
        
        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        
        
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        
        [Required(ErrorMessage = "Invite code is required")]
        public string InviteCode { get; set; }
        
    }
}
