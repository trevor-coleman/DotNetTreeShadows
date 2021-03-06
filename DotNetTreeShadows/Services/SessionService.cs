using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModel;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
  public class SessionService {

    private readonly IMongoCollection<Session> sessions;

    public SessionService (IGameDatabaseSettings settings, IMongoClient client) {
      IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
      sessions = database.GetCollection<Session>( settings.SessionsCollectionName );
    }

    public async Task<List<Session>> Get () { return (await sessions.FindAsync( session => true )).ToList(); }

    public async Task<List<SessionSummary>> GetSessionSummariesForHost (string hostId) {
      FindOptions<Session, SessionSummary> findOptions = new FindOptions<Session, SessionSummary> {
        Projection = Builders<Session>.Projection.Expression(
            session => new SessionSummary( session.Id, session.Name, session.Host, session.HostName )
          )
      };

      ExpressionFilterDefinition<Session>? filter =
        new ExpressionFilterDefinition<Session>( sessionInfo => sessionInfo.Host == hostId );

      return (await sessions.FindAsync( filter, findOptions )).ToList();
    }

    public async Task<List<Session>> GetByHostId (string id) =>
      (await sessions.FindAsync( sessionInfo => sessionInfo.Host == id )).ToList();

    public async Task<Session?> Get (string id) =>
      (await sessions.FindAsync( session => session.Id == id )).FirstOrDefault();

    public async Task<Session> Create (Session session) {
      Console.WriteLine( session.HostName );
      await sessions.InsertOneAsync( session );
      return session;
    }

    public async Task Update (Session sessionIn) =>
      await sessions.ReplaceOneAsync( session => session.Id == sessionIn.Id, sessionIn );

    public async Task Update (string id, Session sessionIn) =>
      await sessions.ReplaceOneAsync( session => session.Id == id, sessionIn );

    public async Task Remove (string id) => await sessions.DeleteOneAsync( sessionInfo => sessionInfo.Id == id );

    public void Remove (Session sessionIn) => sessions.DeleteOne( sessionInfo => sessionInfo.Id == sessionIn.Id );

  }
}
