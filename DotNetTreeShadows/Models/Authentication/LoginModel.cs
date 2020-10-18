using System.ComponentModel.DataAnnotations;

#pragma warning disable 8618

namespace dotnet_tree_shadows.Models.Authentication {
    public class LoginModel {
        
        [EmailAddress, Required(ErrorMessage = "Email is required")]  
        public string Email { get; set; }  
  
        [Required(ErrorMessage = "Password is required")]  
        public string Password { get; set; }  
    }
}
