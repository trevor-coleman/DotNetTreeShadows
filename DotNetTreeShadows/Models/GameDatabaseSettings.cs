using Microsoft.Extensions.Configuration;

#pragma warning disable 8618
namespace dotnet_tree_shadows.Models {
  public class GameDatabaseSettings : IGameDatabaseSettings {
    
    public string Host { get; set; }
    public int Port { get; set; }
    public string DatabaseName { get; set; }
    public string SessionsCollectionName { get; set; }
    public string InvitationsCollectionName { get; set; }
    public string ProfilesCollectionName { get; set; }
    public string GamesCollectionName { get; set; }
    public string BoardsCollectionName { get; set; }
    public string UsersCollection { get; set; }
    public string User { get; set; }
    public string Password { get; set; }

    public string ConnectionString {
      get {
        if ( string.IsNullOrEmpty( User ) || string.IsNullOrEmpty( Password ) ) return $@"mongodb://{Host}:{Port}";
        if(Host == "localhost" || Host == "127.0.0.1") return $"mongodb://{User}:{Password}@{Host}:{Port}";
        return $"mongodb+srv://{User}:{Password}@{Host}?retryWrites=true&w=majority";
      }
    }

  }

  public interface IGameDatabaseSettings {

    public string Host { get; set; }
    public int Port { get; set; }
    public string ConnectionString { get; }
    public string DatabaseName { get; set; }
    public string SessionsCollectionName { get; set; }
    public string InvitationsCollectionName { get; set; }
    public string ProfilesCollectionName { get; set; }
    public string GamesCollectionName { get; set; }
    public string BoardsCollectionName { get; set; }
    public string UsersCollection { get; set; }
    public string User { get; set; }
    public string Password { get; set; }

  }
}
