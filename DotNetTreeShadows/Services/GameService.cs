using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
  public class GameService {

    private readonly IMongoCollection<Game> games;

    public GameService (IGameDatabaseSettings settings) {
      MongoClient client = new MongoClient( settings.ConnectionString );
      IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
      games = database.GetCollection<Game>( settings.GamesCollectionName );
    }

    public async Task<List<Game>> Get () {
      return (await games.FindAsync( session => true )).ToList();
    }
    
    public async Task<Game> Get (string id) =>
      (await games.FindAsync( session => session.Id == id )).FirstOrDefault();

    public async Task<Game> Create (Game game) {
      await games.InsertOneAsync( game );
      return game;
    }

    public async Task Update (Game gameIn) { await games.ReplaceOneAsync( game => game.Id == gameIn.Id, gameIn ); }

    public async Task Update (string id, Game game) =>
      await games.ReplaceOneAsync( session => session.Id == id, game);

    public void Remove (string id) => games.DeleteOne( gameInfo => gameInfo.Id == id );

    public void Remove (Game gameIn) => games.DeleteOne( gameInfo => gameInfo.Id == gameIn.Id );

  }
}
