using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618

namespace dotnet_tree_shadows.Models.Authentication {
    public class RegisterModel {
        
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
        
        [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        
        
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        
        [Required(ErrorMessage = "Invite code is required")]
        public string InviteCode { get; set; }
        
    }
}
