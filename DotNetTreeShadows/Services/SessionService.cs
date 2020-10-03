using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class SessionService {

        private readonly IMongoCollection<SessionInfo> sessions;

        public SessionService (IGameDatabaseSettings settings) {
            MongoClient client = new MongoClient( settings.ConnectionString );
            IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
            sessions = database.GetCollection<SessionInfo>( settings.SessionsCollectionName );
        }

        public async Task<List<SessionInfo>> Get () {
            return (await sessions.FindAsync( session => true )).ToList();
        }

        public async Task<List<SessionSummary>> GetSessionSummariesForHost (string hostId) {
            FindOptions<SessionInfo, SessionSummary> findOptions = new FindOptions<SessionInfo, SessionSummary> {
                                                                            Projection =
                                                                                Builders<SessionInfo>.Projection.Expression(
                                                                                        session => new SessionSummary(
                                                                                                session.Id,
                                                                                                session.Name
                                                                                            )
                                                                                    )
                                                                        };

            var filter =
                new ExpressionFilterDefinition<SessionInfo>( sessionInfo => sessionInfo.Host == hostId );

            return (await sessions.FindAsync( filter, findOptions )).ToList();
        }

        public async Task<List<SessionInfo>> GetByHostId (string id) =>
          (await sessions.FindAsync( sessionInfo => sessionInfo.Host == id )).ToList();

        public async Task<SessionInfo?> Get (string id) => (await sessions.FindAsync( session => session.Id == id )).FirstOrDefault();

        public async Task<SessionInfo> Create (SessionInfo sessionDtoWithId) {
          await sessions.InsertOneAsync( sessionDtoWithId );
            return sessionDtoWithId;
        }

        public async Task Update (string id, SessionInfo sessionIn) =>
            await sessions.ReplaceOneAsync( session => session.Id == id, sessionIn);

        public void Remove (string id) => sessions.DeleteOne( sessionInfo => sessionInfo.Id == id );

        public void Remove (SessionInfo sessionIn) => sessions.DeleteOne( sessionInfo => sessionInfo.Id == sessionIn.Id );
        
    }
}
