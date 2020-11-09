using Mongo.Migration.Migrations.Database;
using Mongo.Migration.Migrations.Document;
using MongoDB.Bson;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Models.GameModel.Migrations {
  public class M002_UndoTestMigration : DocumentMigration<Game> {

    public M002_UndoTestMigration () : base( "0.0.2" ) { }

    public override void Down (BsonDocument document) { document.Add( "Test", "Success" ); }

    public override void Up (BsonDocument document) { document.Remove( "Test" ); }

  }
}
