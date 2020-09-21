using AspNetCore.Identity.Mongo.Model;

namespace dotnet_tree_shadows.Authentication {
    public class ApplicationUser:MongoUser {
        public string UserId {
            get => Id.ToString();
        }
    }
}
