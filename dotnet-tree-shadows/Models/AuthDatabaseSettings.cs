namespace dotnet_tree_shadows.Models {
    public class AuthDatabaseSettings : IAuthDatabaseSettings {
        public string SessionsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IAuthDatabaseSettings {
        public string SessionsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
