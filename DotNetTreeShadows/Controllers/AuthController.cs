using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

//https://www.c-sharpcorner.com/article/authentication-and-authorization-in-asp-net-core-web-api-with-json-web-tokens/


namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController]
    public class AuthController:AControllerWithStatusMethods {

        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<MongoRole> roleManager;
        private IConfiguration configuration;
        
        public AuthController (
                UserManager<UserModel> userManager,
                RoleManager<MongoRole> roleManager,
                IConfiguration configuration
            ) {
            this.userManager =userManager;
            this.roleManager = roleManager;
            this.configuration = configuration;
        }
        
        [HttpPost]  
        [Route("login")]  
        public async Task<IActionResult> Login([FromBody] LoginModel model)  
        {
          UserModel userModel = await userManager.FindByEmailAsync(model.Email);
            if ( userModel == null || !await userManager.CheckPasswordAsync( userModel, model.Password ) ) return Unauthorized();
            IList<string> userRoles = await userManager.GetRolesAsync(userModel);  
  
            List<Claim> authClaims = new List<Claim>  
                                     {
                                         new Claim( ClaimTypes.NameIdentifier, userModel.Id.ToString()  ),
                                         new Claim(ClaimTypes.Name, userModel.UserName),
                                         new Claim(ClaimTypes.Email, userModel.Email),
                                         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),  
                                     };

            authClaims.AddRange( from userRole in userRoles select new Claim( ClaimTypes.Role, userRole ) );

            SymmetricSecurityKey authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["AuthenticationSettings:JWT:Secret"]));  
  
            JwtSecurityToken token = new JwtSecurityToken(  
                    issuer: configuration["AuthenticationSettings:JWT:ValidIssuer"],  
                    audience: configuration["AuthenticationSettings:JWT:ValidAudience"],  
                    expires: DateTime.Now.AddHours(3),  
                    claims: authClaims,  
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)  
                );  
            
            Response.Headers.Add("x-auth-token", new JwtSecurityTokenHandler().WriteToken(token));
  
            return Ok(userModel.UserId);
        }  

        [HttpPost]
        [Route( "register" )]
        public async Task<IActionResult> Register ([FromBody] RegisterModel model) {
            UserModel userModelExists = await userManager.FindByEmailAsync( model.Email );
            if(userModelExists != null) return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });
            if ( model.InviteCode != "ilovetrees" ) return Status403Forbidden();
            
            UserModel userModel = new UserModel() {
                                                             Email = model.Email,
                                                             SecurityStamp = Guid.NewGuid().ToString(),
                                                             UserName = model.Username
                                                         };
            
            IdentityResult result = await userManager.CreateAsync( userModel, model.Password );
            if (!await roleManager.RoleExistsAsync(UserRoles.User))  
                await roleManager.CreateAsync(new MongoRole(UserRoles.User));  
  
            if (await roleManager.RoleExistsAsync(UserRoles.User))  
            {  
                await userManager.AddToRoleAsync(userModel, UserRoles.User);  
            }
            
            return result.Succeeded
                       ? Ok( new Response { Status = "Success", Message = "Created user successfully." } )
                       : StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed. Please try again." });
        }

        [HttpPost, Route( "register-admin" )]
        public async Task<IActionResult> RegisterAdmin ([FromBody] RegisterModel model) {
            UserModel userModelExists = await userManager.FindByEmailAsync( model.Email );
            if(userModelExists != null) return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });

            UserModel userModel = new UserModel() {
                                                             Email = model.Email,
                                                             SecurityStamp = Guid.NewGuid().ToString(),
                                                             UserName = model.Username
                                                         };

            IdentityResult result = await userManager.CreateAsync( userModel, model.Password );
            if(!result.Succeeded) return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed. Please try again." });

            if ( !await roleManager.RoleExistsAsync( UserRoles.Admin ) )
                await roleManager.CreateAsync( new MongoRole( UserRoles.Admin ) );
            
            if ( !await roleManager.RoleExistsAsync( UserRoles.Admin ) ) {
                await roleManager.CreateAsync( new MongoRole( UserRoles.User ) );
            }
            
            if ( await roleManager.RoleExistsAsync( UserRoles.Admin ) ) {
                await userManager.AddToRoleAsync( userModel, UserRoles.Admin );
            }

            return Ok( new Response { Status = "Success", Message = "User created successfully" } );

        }
    }
}














