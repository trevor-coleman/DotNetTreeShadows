using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.Session;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController,
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class GameController : AControllerWithStatusMethods {

      private readonly GameService gameService;
        private readonly UserManager<UserModel> userManager;

        public GameController (
                GameService gameService,
                UserManager<UserModel> userManager
            ) {
          this.gameService = gameService;
            this.userManager = userManager;
        }
      

        [HttpGet( "{id:length(24)}", Name = "GetGame" )]
        public async Task<ActionResult<Game>> Get (string id) {
            UserModel currentUserModel = await userManager.GetUserAsync( HttpContext.User );
            if ( currentUserModel.UserId == null )
                return StatusCode(
                        StatusCodes.Status401Unauthorized,
                        new Response { Status = "Unauthorized", Message = "userId is null" }
                    );

            if ( currentUserModel.Sessions.All( s => s.Id != id ) ) return Status403Forbidden();
            Game? game = await gameService.Get( id );
            if ( game == null ) return NotFound();


            return game;
        }

        
    }
}
