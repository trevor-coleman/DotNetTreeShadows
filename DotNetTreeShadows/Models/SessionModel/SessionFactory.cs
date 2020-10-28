using System.Collections.Generic;
using System.Globalization;
using dotnet_tree_shadows.Models.Authentication;
using XKCDPasswordGen;

namespace dotnet_tree_shadows.Models.SessionModel {
  public class SessionFactory {

    public static Session Create (UserModel host) =>
      new Session {
        Host = host.UserId,
        HostName = host.UserName,
        Name = RandomName(),
        Players = new Dictionary<string, PlayerSummary> { { host.UserId, new PlayerSummary( host ) } }
      };

    public static string RandomName () {
      TextInfo textInfo = new CultureInfo( "en-US", false ).TextInfo;
      return textInfo.ToTitleCase( $"{XkcdPasswordGen.Generate( 3 )}" );
    }

  }
}
