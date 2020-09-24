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
    public class AuthenticateController:AControllerWithStatusMethods {

        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<MongoRole> roleManager;
        private readonly ProfileService profileService;
        private IConfiguration configuration;
        
        public AuthenticateController (
                UserManager<ApplicationUser> userManager,
                ProfileService profileService,
                RoleManager<MongoRole> roleManager,
                IConfiguration configuration
            ) {
            this.userManager =userManager;
            this.profileService = profileService;
            this.roleManager = roleManager;
            this.configuration = configuration;
        }
        
        [HttpPost]  
        [Route("login")]  
        public async Task<IActionResult> Login([FromBody] LoginModel model)  
        {  
            ApplicationUser user = await userManager.FindByEmailAsync(model.Email);
            if ( user == null || !await userManager.CheckPasswordAsync( user, model.Password ) ) return Unauthorized();
            IList<string> userRoles = await userManager.GetRolesAsync(user);  
  
            List<Claim> authClaims = new List<Claim>  
                                     {
                                         new Claim( ClaimTypes.NameIdentifier, user.Id.ToString()  ),
                                         new Claim(ClaimTypes.Name, user.UserName),
                                         new Claim(ClaimTypes.Email, user.Email),
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
  
            return Ok(new  
                      {  
                          token = new JwtSecurityTokenHandler().WriteToken(token),  
                          expiration = token.ValidTo  
                      });
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
            if (!await roleManager.RoleExistsAsync(UserRoles.User))  
                await roleManager.CreateAsync(new MongoRole(UserRoles.User));  
  
            if (await roleManager.RoleExistsAsync(UserRoles.User))  
            {  
                await userManager.AddToRoleAsync(user, UserRoles.User);  
            }
            
            await profileService.Create( new Profile(user) );
            
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

            if ( !await roleManager.RoleExistsAsync( UserRoles.Admin ) )
                await roleManager.CreateAsync( new MongoRole( UserRoles.Admin ) );
            
            if ( !await roleManager.RoleExistsAsync( UserRoles.Admin ) ) {
                await roleManager.CreateAsync( new MongoRole( UserRoles.User ) );
            }
            
            if ( await roleManager.RoleExistsAsync( UserRoles.Admin ) ) {
                await userManager.AddToRoleAsync( user, UserRoles.Admin );
            }

            return Ok( new Response { Status = "Success", Message = "User created successfully" } );

        }
    }
}














