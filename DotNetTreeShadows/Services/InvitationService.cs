using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.InvitationModel;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class InvitationService {
        private readonly IMongoCollection<AInvitation> invitations;

        public InvitationService (IGameDatabaseSettings settings) {
            MongoClient client = new MongoClient( settings.ConnectionString );
            IMongoDatabase database = client.GetDatabase( settings.DatabaseName );
            invitations = database.GetCollection<AInvitation>( settings.InvitationsCollectionName );
        }

        public Task<AInvitation> GetById (string id) {
            return invitations.Find( profile => profile.Id == id ).FirstOrDefaultAsync();
        }

        public async Task<AInvitation> CreateAsync (AInvitation invitation) {
            await invitations.InsertOneAsync( invitation );
            return invitation;
        }
        
        public async Task<SessionInvite> CreateAsync (SessionInvite invitation) {
          await invitations.InsertOneAsync( invitation );
          return invitation;
        }
        public async Task<FriendRequest> CreateAsync (FriendRequest invitation) {
          await invitations.InsertOneAsync( invitation );
          return invitation;
        }

        public async Task Update (string id, AInvitation invitationIn) =>
            await invitations.ReplaceOneAsync( invitation => invitation.Id == id, invitationIn );

        public async Task Remove (string id) =>
            await invitations.DeleteOneAsync( invitation => invitation.Id == id );

        public async Task Remove (AInvitation invitationIn) =>
            await invitations.DeleteOneAsync( invitation => invitation.Id == invitationIn.Id );

        public async Task<List<AInvitation>> GetMany (IEnumerable<string> ids) {
            return (await invitations.FindAsync( invitation => ids.Contains( invitation.Id ) )).ToList();
        }
    }
}
