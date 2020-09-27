using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class SessionService {

        private readonly IMongoCollection<Session> sessions;

        public SessionService (IGameDatabaseSettings settings) {
            MongoClient? client = new MongoClient( settings.ConnectionString );
            IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
            sessions = database.GetCollection<Session>( settings.SessionsCollectionName );
        }

        public async Task<List<Session>> Get () {
            return (await sessions.FindAsync( session => true )).ToList();
        }

        public async Task<List<Session.SessionSummary>> GetSessionSummariesForHost (string hostId) {
            FindOptions<Session, Session.SessionSummary> findOptions = new FindOptions<Session, Session.SessionSummary> {
                                                                            Projection =
                                                                                Builders<Session>.Projection.Expression(
                                                                                        session => new Session.SessionSummary(
                                                                                                session.Id,
                                                                                                session.Name
                                                                                            )
                                                                                    )
                                                                        };

            var filter =
                new ExpressionFilterDefinition<Session>( session => session.Host == hostId );

            return (await sessions.FindAsync( filter, findOptions )).ToList();
        }

        public async Task<List<Session>> GetByHostId (string id) => (await sessions.FindAsync( session => session.Host == id )).ToList();

        public async Task<Session?> Get (string id) => (await sessions.FindAsync( session => session.Id == id )).FirstOrDefault();

        public async Task<Session> Create (Session session) {
            await sessions.InsertOneAsync( session );
            return session;
        }

        public async Task Update (string id, Session sessionIn) =>
            await sessions.ReplaceOneAsync( session => session.Id == id, sessionIn );

        public void Remove (string id) => sessions.DeleteOne( session => session.Id == id );

        public void Remove (Session sessionIn) => sessions.DeleteOne( session => session.Id == sessionIn.Id );
        
    }
}
