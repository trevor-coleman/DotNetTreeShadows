using System;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace dotnet_tree_shadows.Services {
  public class EmailBasedUserIdProvider : IUserIdProvider
  {
    public virtual string GetUserId(HubConnectionContext connection) => connection.User?.FindFirst( ClaimTypes.Email )?.Value;

  }
}
