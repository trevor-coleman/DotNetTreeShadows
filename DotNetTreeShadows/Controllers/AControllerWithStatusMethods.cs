using dotnet_tree_shadows.Models.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_tree_shadows.Controllers {
    public abstract class AControllerWithStatusMethods : ControllerBase {
        protected ObjectResult Status409Duplicate (string duplicateResourceName) =>
            StatusCode(
                    StatusCodes.Status409Conflict,
                    new Response {
                                     Status = $"Duplicate {duplicateResourceName}",
                                     Message = $"An identical {duplicateResourceName} already exists."
                                 }
                );

        protected StatusCodeResult Status403Forbidden () => StatusCode( StatusCodes.Status403Forbidden );

        protected ObjectResult Status404NotFound (string missingResourceName) =>
            StatusCode(
                    StatusCodes.Status404NotFound,
                    new Response {
                                     Status = $"{missingResourceName} not found",
                                     Message = $"No {missingResourceName} exists with that id"
                                 }
                );

        protected ObjectResult Status500MissingProfile () =>
            StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new Response { Status = "Missing Profile", Message = "Cannot find Profile for authenticated user." }
                );
        
        protected ObjectResult Status500UnknownError () =>
          StatusCode(
              StatusCodes.Status500InternalServerError,
              new Response { Status = "Unknown Error", Message = "Unknown internal error." }
            );
        
        protected ObjectResult Status400MissingRequiredField (string missingFieldName) =>
            StatusCode(
                    StatusCodes.Status400BadRequest,
                    new Response {
                                     Status = $"{missingFieldName} is required",
                                     Message = $"Invitation must provide {missingFieldName}."
                                 }
                );
        
        protected ObjectResult Status400Invalid (string invalidPropertyName) =>
            StatusCode(
                    StatusCodes.Status400BadRequest,
                    new Response {
                                     Status = $"Invalid {invalidPropertyName}",
                                     Message = $"Value of {invalidPropertyName} is not acceptable."
                                 }
                );
    }
}
