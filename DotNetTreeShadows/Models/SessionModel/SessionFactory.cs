using System.Globalization;
using dotnet_tree_shadows.Services;
using XKCDPasswordGen;

namespace dotnet_tree_shadows.Models.Session {
  public class SessionFactory {

    public static SessionModel.Session Create (string hostId) => new SessionModel.Session { Host = hostId, Name = RandomName()};

    
    public static string RandomName () {
      TextInfo textInfo = new CultureInfo( "en-US", false ).TextInfo;
      return textInfo.ToTitleCase( $"{XkcdPasswordGen.Generate( 3 )}" );
    }

  }
}
