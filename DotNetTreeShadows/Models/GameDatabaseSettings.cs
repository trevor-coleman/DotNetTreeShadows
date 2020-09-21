#pragma warning disable 8618
namespace dotnet_tree_shadows.Models {
    public class GameDatabaseSettings : IGameDatabaseSettings {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string SessionsCollectionName { get; set; }
        public string InvitationsCollectionName { get; set; }
        public string ProfilesCollectionName { get; set; }
    }

    public interface IGameDatabaseSettings {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string SessionsCollectionName { get; set; }
        public string InvitationsCollectionName { get; set; }
        public string ProfilesCollectionName { get; set; }
    }
}
