using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using dotnet_tree_shadows.Services.Serializers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Services.GameActionService;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Primitives;

namespace dotnet_tree_shadows {
  public class Startup {

    public Startup (IConfiguration configuration) { Configuration = configuration; }
    readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices (IServiceCollection services) {
      //MongoDb
      
      services.Configure<GameDatabaseSettings>( Configuration.GetSection( nameof(GameDatabaseSettings) ) );
      services.AddSignalR();

      string[] allowedOrigins = Configuration.GetSection( "CORS:AllowedOrigins" ).Get<string[]>() ?? new string[0];
      
      services.AddCors(
          options => {
            options.AddPolicy(
                name: MyAllowSpecificOrigins,
                builder => {
                  builder.WithOrigins(
                            allowedOrigins
                           )
                         .AllowAnyHeader()
                         .AllowAnyMethod();
                }
              );
          }
        );
      
      string host = Configuration.GetSection( nameof(GameDatabaseSettings) )["Host"];
      string port = Configuration.GetSection( nameof(GameDatabaseSettings) )["Port"];
      string user = Configuration.GetSection( nameof(GameDatabaseSettings) )["User"];
      string password = Configuration.GetSection( nameof(GameDatabaseSettings) )["Password"];
      string databaseName = Configuration.GetSection( nameof(GameDatabaseSettings) )["DatabaseName"];
      
      string connectionString = ( string.IsNullOrEmpty( user ) || string.IsNullOrEmpty( password ) ) ? $"mongodb://127.0.0.1:{port}": $"mongodb://{user}:{password}@{host}:{port}/{databaseName}/?authSource=admin";
      Console.WriteLine($"\n\n{connectionString}\n\n");
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

      BsonSerializer.RegisterSerializationProvider( new HexCoordinatesSerializationProvider() );
      BsonSerializer.RegisterSerializationProvider( new TilesDictionarySerializationProvider() );
      // BsonSerializer.RegisterSerializationProvider( new GameOptionsDictionarySerializationProvider() );
      // BsonSerializer.RegisterSerializationProvider( new IntStackDictionarySerializationProvider() );
      // BsonSerializer.RegisterSerializationProvider( new IntIntDictionarySerializationProvider() );
      // BsonSerializer.RegisterSerializationProvider( new IntArrayOfIntDictionarySerializationProvider() );

      
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

                         if ( context.Principal.Identity is ClaimsIdentity identity ) {
                           identity.AddClaim( new Claim( "access_token", accessToken.RawData ) );
                         }

                         return Task.CompletedTask;
                       },
                       OnMessageReceived = context => {
                         StringValues accessToken = context.Request.Query["access_token"];

                         PathString path = context.HttpContext.Request.Path;
                         if ( !string.IsNullOrEmpty( accessToken ) && path.StartsWithSegments( "/gamehub" ) ) {
                           context.Token = accessToken;
                         }

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
      app.UseCors(MyAllowSpecificOrigins);

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(
          endpoints => {
            endpoints.MapControllerRoute( name: "default", pattern: "{controller}/{action=Index}/{id?}" );
            endpoints.MapHub<GameHub>( "/gamehub" );
          }
        );

      app.UseSpa(
          spa => {
            spa.Options.SourcePath = "client";

            if ( env.IsDevelopment() ) {
              spa.UseReactDevelopmentServer( npmScript: "start" );
            }
          }
        );
    }

  }
}
