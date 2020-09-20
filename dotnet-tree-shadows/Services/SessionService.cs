using System.Collections.Generic;
using dotnet_tree_shadows.Models;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
    public class SessionService {
        
        private readonly IMongoCollection<Session> sessions;

        public SessionService (IGameDatabaseSettings settings) {
            MongoClient client = new MongoClient(settings.ConnectionString);
            IMongoDatabase database = client.GetDatabase( settings.DatabaseName );
            sessions = database.GetCollection<Session>( settings.SessionsCollectionName );
        }
        
        public List<Session> Get() { return sessions.Find( session => true ).ToList(); }
        
        
        public List<SessionSummary> GetSessionSummariesForHost (string hostId) {
            ProjectionDefinition<Session, SessionSummary> sessionSummary = Builders<Session>.Projection.Expression( session=> new SessionSummary(session.Id, session.Name) );

            return sessions.Find(session => session.Host == hostId ).Project( sessionSummary ).ToList();

        }

        public List<Session> GetByHostId (string id) => sessions.Find( session => session.Host == id ).ToList();

        public Session Get (string id) => sessions.Find( session => session.Id == id ).FirstOrDefault();

        public Session Create (Session session) {
            sessions.InsertOne( session );
            return session;
        }

        public void Update (string id, Session sessionIn) => sessions.ReplaceOne( session => session.Id == id, sessionIn );

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
