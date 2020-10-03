using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class SessionService {

        private readonly IMongoCollection<SessionDtoWithId> sessions;

        public SessionService (IGameDatabaseSettings settings) {
            MongoClient client = new MongoClient( settings.ConnectionString );
            IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
            sessions = database.GetCollection<SessionDtoWithId>( settings.SessionsCollectionName );
        }

        public async Task<List<Session>> Get () {
            return (await sessions.FindAsync( session => true )).ToList().Select( s=> new Session(s)).ToList();
        }

        public async Task<List<SessionSummary>> GetSessionSummariesForHost (string hostId) {
            FindOptions<SessionDtoWithId, SessionSummary> findOptions = new FindOptions<SessionDtoWithId, SessionSummary> {
                                                                            Projection =
                                                                                Builders<SessionDtoWithId>.Projection.Expression(
                                                                                        session => new SessionSummary(
                                                                                                session.Id,
                                                                                                session.Name
                                                                                            )
                                                                                    )
                                                                        };

            var filter =
                new ExpressionFilterDefinition<SessionDtoWithId>( session => session.Host == hostId );

            return (await sessions.FindAsync( filter, findOptions )).ToList();
        }

        public async Task<List<Session>> GetByHostId (string id) =>
          (await sessions.FindAsync( session => session.Host == id )).ToList().Select( s => new Session( s ) ).ToList();

        public async Task<Session?> Get (string id) => new Session((await sessions.FindAsync( session => session.Id == id )).FirstOrDefault());

        public async Task<SessionDtoWithId> Create (SessionDtoWithId sessionDtoWithId) {
          await sessions.InsertOneAsync( sessionDtoWithId );
            return sessionDtoWithId;
        }

        public async Task Update (string id, Session sessionIn) =>
            await sessions.ReplaceOneAsync( session => session.Id == id, sessionIn.DtoWithId() );

        public void Remove (string id) => sessions.DeleteOne( session => session.Id == id );

        public void Remove (Session sessionIn) => sessions.DeleteOne( session => session.Id == sessionIn.Id );
        
    }
}
