using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.InvitationModel;
using dotnet_tree_shadows.Models.SessionModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class InvitationService {

      private readonly SessionService sessionService;
      private readonly UserManager<UserModel> userManager;
      private readonly IMongoCollection<Invitation> invitations;

        public InvitationService (IGameDatabaseSettings settings) {
          MongoClient client = new MongoClient( settings.ConnectionString );
            IMongoDatabase database = client.GetDatabase( settings.DatabaseName );
            invitations = database.GetCollection<Invitation>( settings.InvitationsCollectionName );
        }

        public Task<Invitation> GetById (string id) {
            return invitations.Find( profile => profile.Id == id ).FirstOrDefaultAsync();
        }

        public async Task<Invitation> CreateAsync (Invitation invitation) {
            await invitations.InsertOneAsync( invitation );
            return invitation;
        }
        
      
        public async Task Update (string id, Invitation invitationIn) =>
            await invitations.ReplaceOneAsync( invitation => invitation.Id == id, invitationIn );

        public async Task Remove (string id) =>
            await invitations.DeleteOneAsync( invitation => invitation.Id == id );

        public async Task Remove (Invitation invitationIn) =>
            await invitations.DeleteOneAsync( invitation => invitation.Id == invitationIn.Id );

        public async Task<List<Invitation>> GetMany (IEnumerable<string> ids) {
            return (await invitations.FindAsync( invitation => ids.Contains( invitation.Id ) )).ToList();
        }

        public async Task<List<Invitation>> GetByUserId (string id) {
          return (await invitations.FindAsync( invitation => invitation.SenderId == id || invitation.RecipientId == id )).ToList();
        }

    }
}
