using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
  public class GameService {

    private readonly IMongoCollection<GameInfo> games;

    public GameService (IGameDatabaseSettings settings) {
      MongoClient client = new MongoClient( settings.ConnectionString );
      IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
      games = database.GetCollection<GameInfo>( settings.GamesCollectionName );
    }

    public async Task<List<GameInfo>> Get () {
      return (await games.FindAsync( session => true )).ToList();
    }
    
    public async Task<GameInfo> Get (string id) =>
      (await games.FindAsync( session => session.Id == id )).FirstOrDefault();

    public async Task<GameInfo> Create (GameInfo gameInfo) {
      await games.InsertOneAsync( gameInfo );
      return gameInfo;
    }

    public async Task Update (string id, GameInfo gameInfo) =>
      await games.ReplaceOneAsync( session => session.Id == id, gameInfo);

    public void Remove (string id) => games.DeleteOne( gameInfo => gameInfo.Id == id );

    public void Remove (GameInfo gameInfoIn) => games.DeleteOne( gameInfo => gameInfo.Id == gameInfoIn.Id );
  }
}
