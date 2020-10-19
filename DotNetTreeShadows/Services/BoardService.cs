using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Services {
  public class BoardService {

    private readonly IMongoCollection<Board> boards;

    public BoardService (IGameDatabaseSettings settings) {
      MongoClient client = new MongoClient( settings.ConnectionString );
      IMongoDatabase? database = client.GetDatabase( settings.DatabaseName );
      boards = database.GetCollection<Board>( settings.BoardsCollectionName );
    }

    public async Task<List<Board>> Get () {
      return (await boards.FindAsync( session => true )).ToList();
    }
    
    public async Task<Board> Get (string id) =>
      (await boards.FindAsync( session => session.Id == id )).FirstOrDefault();

    public async Task<Board> Create (Board board) {
      await boards.InsertOneAsync( board );
      return board;
    }
    
    public async Task Update (string id, Board board) =>
      await boards.ReplaceOneAsync( board => board.Id == id, board);

    public void Remove (string id) => boards.DeleteOne( boardInfo => boardInfo.Id == id );

    public void Remove (Board boardIn) => boards.DeleteOne( boardInfo => boardInfo.Id == boardIn.Id );
  }
}
