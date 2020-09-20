namespace dotnet_tree_shadows.Models {
    public class GameDatabaseSettings : IGameDatabaseSettings {
        public string SessionsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IGameDatabaseSettings {
        public string SessionsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
