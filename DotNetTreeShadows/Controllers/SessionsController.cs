using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModels;
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
    public class SessionsController : AControllerWithStatusMethods {
        private readonly SessionService sessionService;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ProfileService profileService;
        private readonly InvitationService invitationService;

        public SessionsController (
                SessionService sessionService,
                UserManager<ApplicationUser> userManager,
                ProfileService profileService,
                InvitationService invitationService
            ) {
            this.sessionService = sessionService;
            this.userManager = userManager;
            this.profileService = profileService;
            this.invitationService = invitationService;
        }
        
        [HttpPost]
        [Route("{sessionId:length(24)}/players")]
        public async Task<ActionResult> InvitePlayer ([FromRoute] string sessionId, [FromBody] ObjectIdModel idModel) {
            string recipientId = idModel.Id;
            Task<Session?> sessionTask =  sessionService.Get( sessionId );
            Task<ApplicationUser>? userTask =  userManager.GetUserAsync( HttpContext.User );
            

            Session session = await sessionTask;
            if ( session == null ) return Status404NotFound( "Session" );

            ApplicationUser user = await userTask;
            if ( session.Host != user.UserId ) return Status403Forbidden();
            if ( user.UserId == recipientId ) return Status400Invalid( "recipientID" );

            Task<Profile> senderTask = profileService.GetByIdAsync( user.UserId );
            Task<Profile> recipientTask = profileService.GetByIdAsync( recipientId );

            await Task.WhenAll( senderTask, recipientTask );

            Profile sender = await senderTask;
            Profile recipient = await recipientTask;
            
            if ( recipient == null ) return Status404NotFound( "Recipient" );
            if ( !recipient.HasFriend( sender.Id ) ) return Status403Forbidden();
            if ( session.HasInvited( recipient.Id ) ) return Status409Duplicate( "Invitation" );

            Invitation sessionInvitation = Invitation.SessionInvitation( sender, recipient, session );

            List<Invitation> recipientInvitations =
                await invitationService.GetMany( recipient.ReceivedInvitations );

            if ( recipientInvitations.Any( sessionInvitation.IsDuplicate ) ) return Status409Duplicate( "Invitation" );

            Invitation createdInvitation = await invitationService.CreateAsync( sessionInvitation );
            
            sender.AddSentInvitation( createdInvitation.Id );
            Task updateSender = profileService.Update( sender.Id, sender );
            
            recipient.AddReceivedInvitation( createdInvitation.Id );
            Task updateRecipient = profileService.Update( recipientId, recipient );
            
            session.AddInvitation( createdInvitation.Id );
            Task updateSession = sessionService.Update( session.Id, session );
            

            await Task.WhenAll( updateSession, updateSender, updateRecipient );

            return Ok();
        }

        [HttpGet( "{id:length(24)}", Name = "GetSession" )]
        public async Task<ActionResult<SessionDto>> Get (string id) {
            Session? session = await sessionService.Get( id );
            if ( session == null ) return NotFound();

            ApplicationUser currentUser = await userManager.GetUserAsync( HttpContext.User );
            if ( currentUser.UserId == null )
                return StatusCode(
                        StatusCodes.Status401Unauthorized,
                        new Response { Status = "Unauthorized", Message = "userId is null" }
                    );

            return session.Dto();
        }

        [HttpPost]
        public async Task<ActionResult<SessionDto>> Create () {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            if (user?.UserId == null ) return StatusCode( StatusCodes.Status403Forbidden );
            
            Profile? userProfile = await profileService.GetByIdAsync( user.UserId );
            if ( userProfile == null )
                return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new Response {
                                         Status = "Missing Profile Data",
                                         Message = "UsedId Authenticated, but user profile data is missing."
                                     }
                    );

            Session session = new Session( userProfile);
            Session createdSession = await sessionService.Create( session );
            userProfile.AddSession( createdSession );
            await profileService.Update( user.UserId, userProfile );
            return CreatedAtRoute( "GetSession", new { id = createdSession.Id }, createdSession.Dto() );
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
            Session? session = await sessionService.Get( id );

            if ( session == null ) {
                return NotFound();
            }

            sessionService.Remove( session.Id );

            return NoContent();
        }
    }
}
