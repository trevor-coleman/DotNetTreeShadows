using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController, Authorize(Roles=UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ProfilesController:ControllerBase {

        private readonly ProfileService profileService;
        private UserManager<ApplicationUser> userManager;

        public ProfilesController (ProfileService profileService, UserManager<ApplicationUser> userManager) {
            
        }
        
        [HttpGet( "id:length(24)", Name = "GetProfile" )]
        public async Task<ActionResult<Profile>> Get (string id) => await profileService.GetById( id );

    }
}
