using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace dotnet_tree_shadows {
    public class Startup {
        public Startup (IConfiguration configuration) { Configuration = configuration; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            //MongoDb
            services.Configure<GameDatabaseSettings>( Configuration.GetSection( nameof(GameDatabaseSettings) ) );

            services.AddIdentityMongoDbProvider<ApplicationUser, MongoRole>(
                    identityOptions => {
                        identityOptions.Password.RequiredLength = 6;
                        identityOptions.Password.RequireLowercase = false;
                        identityOptions.Password.RequireUppercase = false;
                        identityOptions.Password.RequireNonAlphanumeric = false;
                        identityOptions.Password.RequireDigit = false;
                    },
                    mongoIdentityOptions => {
                        mongoIdentityOptions.ConnectionString =
                            Configuration.GetSection( nameof(AuthDatabaseSettings) )["ConnectionString"];

                        mongoIdentityOptions.UsersCollection = Configuration["AuthDatabaseSettings:UsersCollection"];
                    }
                );

            services.AddSingleton<SessionService>();
            services.AddSingleton<ProfileService>();

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
                                                                              if ( context.SecurityToken is
                                                                                  JwtSecurityToken
                                                                                  accessToken ) {
                                                                                  if ( context.Principal.Identity is
                                                                                      ClaimsIdentity
                                                                                      identity ) {
                                                                                      identity.AddClaim(
                                                                                              new Claim(
                                                                                                      "access_token",
                                                                                                      accessToken
                                                                                                         .RawData
                                                                                                  )
                                                                                          );
                                                                                  }
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
                                                                                 Encoding.UTF8.GetBytes(
                                                                                         Configuration[
                                                                                             "AuthenticationSettings:JWT:Secret"]
                                                                                     )
                                                                             )
                                                                     };
                             }
                         );

            services.AddControllersWithViews().AddNewtonsoftJson();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles( configuration => { configuration.RootPath = "ClientApp/build"; } );
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

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(
                    endpoints => {
                        endpoints.MapControllerRoute( name: "default", pattern: "{controller}/{action=Index}/{id?}" );
                    }
                );

            app.UseSpa(
                    spa => {
                        spa.Options.SourcePath = "ClientApp";

                        if ( env.IsDevelopment() ) {
                            spa.UseReactDevelopmentServer( npmScript: "start" );
                        }
                    }
                );
        }
    }
}
