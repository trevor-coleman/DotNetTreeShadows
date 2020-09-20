using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_tree_shadows.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase {
        private readonly SessionService sessionService;
        private Random random = new Random();

        public SessionsController (SessionService sessionService) {
            this.sessionService = sessionService;
        }

        [HttpGet]
        public ActionResult<List<Session>> Get () => sessionService.Get();

        [HttpGet( "id:length(24)", Name = "GetSession" )]
        public ActionResult<Session> Get (string id) {
            Session session = sessionService.Get( id );
            if ( session == null ) {
                return NotFound();
            }

            return session;
        }

        [HttpGet, Route("new")]
        public async Task<ActionResult<Session>> Create () {
            
            ApplicationUser currentUser = await userManager.GetUserAsync( HttpContext.User );
            
            string userId = currentUser.Id.ToString();
            
            if ( userId == null )
                return StatusCode(
                        StatusCodes.Status401Unauthorized,
                        new Response { Status = "Unauthorized", Message = "userId is null" }
                    );
                                                             Session session = new Session( userId, currentUser.UserName, null );
            sessionService.Create(session );
            return CreatedAtRoute( "GetSession", new { id = session.Id.ToString() }, session );
        }

        [HttpPut]
        public IActionResult Update (string id, Session sessionIn) {
            Session session = sessionService.Get( id );
            if ( session == null ) {
                return NotFound();
            }
            sessionService.Update( id, sessionIn );
            return NoContent();
        }

        [HttpDelete]
        public IActionResult Delete (string id) {
            Session session = sessionService.Get( id );

            if ( session == null ) {
                return NotFound();
            }
            
            sessionService.Remove( session.Id );

            return NoContent();
        }
    }
}
