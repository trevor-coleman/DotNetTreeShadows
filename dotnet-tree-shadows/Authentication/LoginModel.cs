using System.ComponentModel.DataAnnotations;

namespace dotnet_tree_shadows.Authentication {
    public class LoginModel {
        
        [EmailAddress, Required(ErrorMessage = "Email is required")]  
        public string Email { get; set; }  
  
        [Required(ErrorMessage = "Password is required")]  
        public string Password { get; set; }  
    }
}
