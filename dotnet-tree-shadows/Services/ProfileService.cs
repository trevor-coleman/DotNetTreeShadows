using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class ProfileService {
        
        private readonly IMongoCollection<Profile> profiles;

        public ProfileService (IGameDatabaseSettings settings) {
            MongoClient client = new MongoClient(settings.ConnectionString);
            IMongoDatabase database = client.GetDatabase( settings.DatabaseName );
            profiles = database.GetCollection<Profile>( settings.ProfilesCollectionName );
        }

        public Task<Profile> GetByIdAsync (string id) {
            return profiles.Find( profile => profile.Id == id ).FirstOrDefaultAsync();
        }

        public async Task<Profile> Create (Profile profile) {
            await profiles.InsertOneAsync( profile );
            return profile;
        }

        public async Task Update (string id, Profile profileIn) => await profiles.ReplaceOneAsync( profile => profile.Id == id, profileIn );

        public void Remove (string id) => profiles.DeleteOne( profile => profile.Id == id );

        public void Remove (Profile profileIn) => profiles.DeleteOne( profile => profile.Id == profileIn.Id );

        public List<Profile> GetMany (IEnumerable<string> ids) {
            return profiles.Find( profile => ids.Contains( profile.Id ) ).ToList();
        }
        
    }
}
