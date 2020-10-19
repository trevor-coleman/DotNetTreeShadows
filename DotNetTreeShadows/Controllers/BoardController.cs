using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController,
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class BoardController : AControllerWithStatusMethods {

      private readonly BoardService boardService;
        private readonly UserManager<UserModel> userManager;

        public BoardController (
                BoardService boardService,
                UserManager<UserModel> userManager
            ) {
          this.boardService = boardService;
            this.userManager = userManager;
        }
      

        [HttpGet( "{id:length(24)}", Name = "GetBoard" )]
        public async Task<ActionResult<Board>> Get (string id) {
            UserModel currentUserModel = await userManager.GetUserAsync( HttpContext.User );
            if ( currentUserModel.UserId == null )
                return StatusCode(
                        StatusCodes.Status401Unauthorized,
                        new Response { Status = "Unauthorized", Message = "userId is null" }
                    );

            if ( currentUserModel.Sessions.All( s => s.Id != id ) ) return Status403Forbidden();
            Board? board = await boardService.Get( id );
            if ( board == null ) return NotFound();


            return board;
        }

        
    }
}
