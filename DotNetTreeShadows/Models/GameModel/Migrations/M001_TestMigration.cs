using Mongo.Migration.Migrations.Database;
using Mongo.Migration.Migrations.Document;
using MongoDB.Bson;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Models.GameModel.Migrations {
  public class M001_TestMigration : DocumentMigration<Game> {

    public M001_TestMigration () : base( "0.0.1" ) { }

    public override void Up (BsonDocument document) { document.Add( "Test", "Success" ); }

    public override void Down (BsonDocument document) { document.Remove( "Test" ); }

  }
}
