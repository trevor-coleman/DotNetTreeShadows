using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Services;
using dotnet_tree_shadows.Services.GameActionService;
using dotnet_tree_shadows.Services.Serializers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Mongo.Migration.Startup;
using Mongo.Migration.Startup.DotNetCore;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace dotnet_tree_shadows {
  public class Startup {

    private readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

    public Startup (IConfiguration configuration) { Configuration = configuration; }
    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices (IServiceCollection services) {
      //MongoDb

      services.AddSignalR().AddNewtonsoftJsonProtocol();
      services.Configure<GameDatabaseSettings>( Configuration.GetSection( nameof(GameDatabaseSettings) ) );

      string host = Configuration.GetSection( nameof(GameDatabaseSettings) )["Host"];
      string port = Configuration.GetSection( nameof(GameDatabaseSettings) )["Port"];
      string user = Configuration.GetSection( nameof(GameDatabaseSettings) )["User"];
      string password = Configuration.GetSection( nameof(GameDatabaseSettings) )["Password"];
      string databaseName = Configuration.GetSection( nameof(GameDatabaseSettings) )["DatabaseName"];

      string connectionString = string.IsNullOrEmpty( user ) || string.IsNullOrEmpty( password )
                                  ? $"mongodb://127.0.0.1:{port}"
                                  : host == "localhost" || host == "127.0.0.1"
                                    ? $"mongodb://{user}:{password}@{host}:{port}/{databaseName}?authSource=admin"
                                    : $"mongodb+srv://{user}:{password}@{host}/{databaseName}?retryWrites=true&w=majority";

      services.AddSingleton<IMongoClient>( new MongoClient( connectionString ) );
      services.AddIdentityMongoDbProvider<UserModel, MongoRole>(
          identityOptions => {
            identityOptions.Password.RequiredLength = 6;
            identityOptions.Password.RequireLowercase = false;
            identityOptions.Password.RequireUppercase = false;
            identityOptions.Password.RequireNonAlphanumeric = false;
            identityOptions.Password.RequireDigit = false;
          },
          mongoIdentityOptions => {
            mongoIdentityOptions.ConnectionString = connectionString;
            mongoIdentityOptions.UsersCollection = "Users";
            mongoIdentityOptions.RolesCollection = "Roles";
          }
        );

      services.AddMigration(
          new MongoMigrationSettings { ConnectionString = connectionString, Database = databaseName }
        );

      string[] allowedOrigins = Configuration.GetSection( "CORS:AllowedOrigins" ).Get<string[]>() ?? new string[0];

      services.AddCors(
          options => {
            options.AddPolicy(
                MyAllowSpecificOrigins,
                builder => { builder.WithOrigins( allowedOrigins ).AllowAnyHeader().AllowAnyMethod(); }
              );
          }
        );

      BsonSerializer.RegisterSerializationProvider( new HexSerializationProvider() );
      BsonSerializer.RegisterSerializationProvider( new TilesDictionarySerializationProvider() );
      BsonSerializer.RegisterSerializationProvider( new IntArrayOfIntDictionarySerializationProvider() );
      BsonSerializer.RegisterSerializationProvider( new TokenStacksSerializationProvider() );

      services.AddSingleton<SessionService>();
      services.AddSingleton<InvitationService>();
      services.AddSingleton<GameService>();
      services.AddSingleton<HubGroupService>();
      services.AddSingleton<BoardService>();
      services.AddSingleton<GameActionService>();

      services.AddSingleton<IGameDatabaseSettings>(
          sp => sp.GetRequiredService<IOptions<GameDatabaseSettings>>().Value
        );

      //Authentication
      services.AddAuthentication(
                 options => {
                   options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                   options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                   options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                 }
               )
              .AddJwtBearer(
                   options => {
                     options.Events = new JwtBearerEvents {
                       OnTokenValidated = context => {
                         if ( !(context.SecurityToken is JwtSecurityToken accessToken) ) return Task.CompletedTask;

                         if ( context.Principal.Identity is ClaimsIdentity identity )
                           identity.AddClaim( new Claim( "access_token", accessToken.RawData ) );

                         return Task.CompletedTask;
                       },
                       OnMessageReceived = context => {
                         StringValues accessToken = context.Request.Query["access_token"];

                         PathString path = context.HttpContext.Request.Path;
                         if ( !string.IsNullOrEmpty( accessToken ) && path.StartsWithSegments( "/gamehub" ) )
                           context.Token = accessToken;

                         return Task.CompletedTask;
                       }
                     };

                     options.SaveToken = true;
                     options.RequireHttpsMetadata = false;
                     options.TokenValidationParameters = new TokenValidationParameters {
                       ValidateIssuer = true,
                       ValidateAudience = true,
                       ValidAudience = Configuration["AuthenticationSettings:JWT:ValidAudience"],
                       ValidIssuer = Configuration["AuthenticationSettings:JWT:ValidIssuer"],
                       IssuerSigningKey = new SymmetricSecurityKey(
                           Encoding.UTF8.GetBytes( Configuration["AuthenticationSettings:JWT:Secret"] )
                         )
                     };
                   }
                 );

      services.AddControllersWithViews().AddNewtonsoftJson();
      services.AddControllers().AddNewtonsoftJson();

      // In production, the React files will be served from this directory
      services.AddSpaStaticFiles( configuration => { configuration.RootPath = "client/build"; } );
      services.AddSingleton<IUserIdProvider, EmailBasedUserIdProvider>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure (IApplicationBuilder app, IWebHostEnvironment env) {
      if ( env.IsDevelopment() ) {
        app.UseDeveloperExceptionPage();
      } else {
        app.UseExceptionHandler( "/Error" );
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseSpaStaticFiles();

      app.UseRouting();
      app.UseCors( MyAllowSpecificOrigins );

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(
          endpoints => {
            endpoints.MapControllerRoute( "default", "{controller}/{action=Index}/{id?}" );
            endpoints.MapHub<GameHub>( "/gamehub" );
          }
        );

      app.UseSpa(
          spa => {
            spa.Options.SourcePath = "client";

            if ( env.IsDevelopment() ) spa.UseReactDevelopmentServer( "start" );
          }
        );
    }

  }
}
