using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_tree_shadows.Controllers {
    [ApiController, 
     Route("/api/sessions/{sessionId:length(24)}/[controller]"), 
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class GameController : AControllerWithStatusMethods {

        private readonly SessionService sessionService;
        private readonly UserManager<ApplicationUser> userManager;
        
        public GameController (SessionService sessionService, UserManager<ApplicationUser> userManager) {
            this.sessionService = sessionService;
            this.userManager = userManager;
        }
        
        [HttpPost]
        [Route( "actions" )]
        public async Task<ActionResult<Session>> DoAction ([FromRoute] string sessionId, [FromBody] GameAction gameAction) {
            
            Task<Session>? sessionTask =  sessionService.Get( sessionId );
            Task<ApplicationUser>? userTask =  userManager.GetUserAsync( HttpContext.User );
            
            ApplicationUser user = await userTask;
            Session session = await sessionTask;
            if ( session == null ) return Status404NotFound( "Session" );
            if ( !session.HasPlayer( user.UserId ) ) return Status403Forbidden();

            if ( !session.TryProcessAction( user.UserId, gameAction, out string message ) ) {
                return Status400Invalid( message );
            } else {

                await sessionService.Update( sessionId, session );
                return session;
            }
        }


    }
}
