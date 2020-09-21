using System.Collections.Generic;
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
    [Route( "api/[controller]" ), ApiController,
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class SessionsController : ControllerBase {
        private readonly SessionService sessionService;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ProfileService profileService;

        public SessionsController (
                SessionService sessionService,
                UserManager<ApplicationUser> userManager,
                ProfileService profileService
            ) {
            this.sessionService = sessionService;
            this.userManager = userManager;
            this.profileService = profileService;
        }

        [HttpGet]
        public async Task<List<SessionService.SessionSummary>> Get () {
            ApplicationUser currentUser = await userManager.GetUserAsync( HttpContext.User );

            string userId = currentUser.Id.ToString();

            return await sessionService.GetSessionSummariesForHost( userId );
        }

        [HttpPost]
        [Route("{id:length(24)}/players")]
        public async Task<ActionResult> InvitePlayer (string id, [FromBody] string recipientId) {
            Session session = await sessionService.Get( id );
            if ( session == null )
                return StatusCode(
                        StatusCodes.Status404NotFound,
                        new Response { Status = "Session not found", Message = "No session exists with that id" }
                    );

            ApplicationUser currentUser = await userManager.GetUserAsync( HttpContext.User );

            if ( session.Host != currentUser.UserId ) return StatusCode( StatusCodes.Status403Forbidden );

            Task<Profile> senderTask = profileService.GetByIdAsync( currentUser.UserId );
            Task<Profile> recipientTask = profileService.GetByIdAsync( recipientId );

            await Task.WhenAll( senderTask, recipientTask );

            Profile sender = await senderTask;
            Profile recipient = await recipientTask;

            if ( !recipient.IsFriendsWith( sender.Id ) ) return StatusCode( StatusCodes.Status403Forbidden );

            if ( recipient == null )
                return StatusCode(
                        StatusCodes.Status404NotFound,
                        new Response { Status = "Recipient not found", Message = "No player exists with that id" }
                    );

            if ( session.HasInvited( recipient.Id ) )
                return StatusCode(
                        StatusCodes.Status409Conflict,
                        new Response {
                                         Status = "Already Invited",
                                         Message = "That player has already been invited to the session."
                                     }
                    );

            Invitation invitation = session.Invite( recipient.Id, sender.Id );

            sender.SendInvitation( invitation );
            recipient.ReceiveInvitation( invitation );

            Task updateSession = sessionService.Update( session.Id, session );
            Task updateSender = profileService.Update( sender.Id, sender );
            Task updateRecipient = profileService.Update( recipientId, recipient );

            await Task.WhenAll( updateSession, updateSender, updateRecipient );

            return Ok();
        }

        [HttpGet( "id:length(24)", Name = "GetSession" )]
        public async Task<ActionResult<Session>> Get (string id) {
            Session session = await sessionService.Get( id );
            if ( session == null ) return NotFound();

            ApplicationUser currentUser = await userManager.GetUserAsync( HttpContext.User );
            if ( currentUser.UserId == null )
                return StatusCode(
                        StatusCodes.Status401Unauthorized,
                        new Response { Status = "Unauthorized", Message = "userId is null" }
                    );

            return session;
        }

        [HttpGet, Route( "new" )]
        public async Task<ActionResult<Session>> Create () {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            if ( user.UserId == null ) return StatusCode( StatusCodes.Status403Forbidden );
            
            Profile? userProfile = await profileService.GetByIdAsync( user.UserId );
            if ( userProfile == null )
                return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new Response {
                                         Status = "Missing Profile Data",
                                         Message = "UsedId Authenticated, but user profile data is missing."
                                     }
                    );

            Session session = new Session( user.UserId, user.UserName, null );
            Session createdSession = await sessionService.Create( session );
            userProfile.AddSession( createdSession.Id );
            await profileService.Update( userProfile.Id, userProfile );
            return CreatedAtRoute( "GetSession", new { id = session.Id }, session );
        }

        // [HttpPut("id:length(24")]
        // public IActionResult Update (string id, [FromBody] Session sessionIn) {
        //     Session session = sessionService.Get( id );
        //     if ( session == null ) {
        //         return NotFound();
        //     }
        //     sessionService.Update( id, sessionIn );
        //     return NoContent();
        // }

        [HttpDelete]
        public async Task<IActionResult> Delete (string id) {
            Session session = await sessionService.Get( id );

            if ( session == null ) {
                return NotFound();
            }

            sessionService.Remove( session.Id );

            return NoContent();
        }
    }
}
