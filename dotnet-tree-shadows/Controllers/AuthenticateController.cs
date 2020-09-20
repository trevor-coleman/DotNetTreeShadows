using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

//https://www.c-sharpcorner.com/article/authentication-and-authorization-in-asp-net-core-web-api-with-json-web-tokens/

//TODO: UPDATE AUTHENTICATE CONTROLLER TO WORK WITH MONGODB IDENTITY SERVICE

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController]
    public class AuthenticateController:ControllerBase {

        private UserManager<ApplicationUser> userManager;
        
        public AuthenticateController (
                UserManager<ApplicationUser> userManager,
                IConfiguration configuration
            ) {
            userManager.FindByEmailAsync( "email" );
        }

        [HttpPost]
        [Route( "register" )]
        public async Task<IActionResult> Register ([FromBody] RegisterModel model) {
            ApplicationUser userExists = await userManager.FindByEmailAsync( model.Email );
            if(userExists != null) return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new ApplicationUser() {
                                                             Email = model.Email,
                                                             SecurityStamp = Guid.NewGuid().ToString(),
                                                             UserName = model.Username
                                                         };

            IdentityResult result = await userManager.CreateAsync( user, model.Password );
            return result.Succeeded
                       ? Ok( new Response { Status = "Success", Message = "Created user successfully." } )
                       : StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed. Please try again." });
        }

        [HttpPost, Route( "register-admin" )]
        public async Task<IActionResult> RegisterAdmin ([FromBody] RegisterModel model) {
            ApplicationUser userExists = await userManager.FindByEmailAsync( model.Email );
            if(userExists != null) return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });

            ApplicationUser user = new ApplicationUser() {
                                                             Email = model.Email,
                                                             SecurityStamp = Guid.NewGuid().ToString(),
                                                             UserName = model.Username
                                                         };

            IdentityResult result = await userManager.CreateAsync( user, model.Password );
            if(!result.Succeeded) return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed. Please try again." });

            // if ( !await roleManager.RoleExistsAsync( UserRoles.Admin.Name ) )
            //     await roleManager.CreateAsync( new MongoRole( UserRoles.Admin.Name ) );
            //
            // if ( !await roleManager.RoleExistsAsync( UserRoles.Admin.Name ) ) {
            //     await roleManager.CreateAsync( new MongoRole( UserRoles.User.Name ) );
            // }
            //
            // if ( await roleManager.RoleExistsAsync( UserRoles.Admin.Name ) ) {
            //     await userManager.AddToRoleAsync( user, UserRoles.Admin.Name );
            // }

            return Ok( new Response { Status = "Success", Message = "User created successfully" } );

        }
    }
}














