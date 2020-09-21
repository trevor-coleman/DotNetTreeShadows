using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class SessionService {

        private readonly IMongoCollection<Session> sessions;

        public SessionService (IGameDatabaseSettings settings) {
            var client = new MongoClient( settings.ConnectionString );
            IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
            sessions = database.GetCollection<Session>( settings.SessionsCollectionName );
        }

        public List<Session> Get () { return sessions.Find( session => true ).ToList(); }

        public async Task<List<SessionSummary>> GetSessionSummariesForHost (string hostId) {
            var findOptions = new FindOptions<Session, SessionSummary> {
                                                                           Projection =
                                                                               Builders<Session>.Projection.Expression(
                                                                                       session => new SessionSummary(
                                                                                               session.Id,
                                                                                               session.Name
                                                                                           )
                                                                                   )
                                                                       };

            var filter =
                new ExpressionFilterDefinition<Session>( session => session.Host == hostId );

            return await (await sessions.FindAsync( filter, findOptions )).ToListAsync();
        }

        public List<Session> GetByHostId (string id) => sessions.Find( session => session.Host == id ).ToList();

        public async Task<Session> Get (string id) => sessions.Find( session => session.Id == id ).FirstOrDefault();

        public async Task<Session> Create (Session session) {
            await sessions.InsertOneAsync( session );
            return session;
        }

        public async Task Update (string id, Session sessionIn) =>
            await sessions.ReplaceOneAsync( session => session.Id == id, sessionIn );

        public void Remove (string id) => sessions.DeleteOne( session => session.Id == id );

        public void Remove (Session sessionIn) => sessions.DeleteOne( session => session.Id == sessionIn.Id );

        public class SessionSummary {
            public string Id { get; set; }
            public string Name { get; set; }

            public SessionSummary (string id, string name) {
                Id = id;
                Name = name;
            }

        }

    }
}
