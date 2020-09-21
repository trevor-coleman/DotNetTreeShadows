using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
#pragma warning disable 8618

namespace dotnet_tree_shadows.Pages {
    [ResponseCache( Duration = 0, Location = ResponseCacheLocation.None, NoStore = true )]
    public class ErrorModel : PageModel {
        // ReSharper disable once NotAccessedField.Local
        private readonly ILogger<ErrorModel> logger;

        public ErrorModel (ILogger<ErrorModel> logger) { this.logger = logger; }
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty( RequestId );

        public void OnGet () { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier; }
    }
}
