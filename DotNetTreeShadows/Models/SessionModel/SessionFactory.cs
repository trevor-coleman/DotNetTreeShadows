using System.Collections.Generic;
using System.Globalization;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models.DataModels;
using dotnet_tree_shadows.Services;
using XKCDPasswordGen;

namespace dotnet_tree_shadows.Models.Session {
  public class SessionFactory {

    public static SessionModel.Session Create (UserModel host) => new SessionModel.Session { Host = host.UserId, Name = RandomName(), Players = new Dictionary<string, PlayerSummary> {
        { host.UserId, new PlayerSummary(host)} }};

    
    public static string RandomName () {
      TextInfo textInfo = new CultureInfo( "en-US", false ).TextInfo;
      return textInfo.ToTitleCase( $"{XkcdPasswordGen.Generate( 3 )}" );
    }

  }
}
