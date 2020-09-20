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
        
        public List<Session> Get() => sessions.Find( session => true ).ToList();

        public Session Get (string id) => sessions.Find( session => session.Id == id ).FirstOrDefault();

        public Session Create (Session session) {
            sessions.InsertOne( session );
            return session;
        }

        public void Update (string id, Session sessionIn) => sessions.ReplaceOne( session => session.Id == id, sessionIn );

        public void Remove (string id) => sessions.DeleteOne( session => session.Id == id );

        public void Remove (Session sessionIn) => sessions.DeleteOne( session => session.Id == sessionIn.Id );

    }
}
