namespace dotnet_tree_shadows.Hubs {
  public class TaskResponse {

    public bool Success { get; set; }
    public string? Message { get; set; }

    public TaskResponse (bool success, string? message) {
      Success = success;
      Message = message;
    }

    public TaskResponse (bool success) { Success = success; }

    public static TaskResponse Ok {
      get => new TaskResponse( true );
    }

    public static TaskResponse Fail (string message) => new TaskResponse( false, message );
    public static TaskResponse Fail () => new TaskResponse( false );

    public static TaskResponse HostOnly {
      get => new TaskResponse( false, "Only the host can perform this action" );
    }

    public static TaskResponse NotFound (string item) => TaskResponse.Fail( $"{item} not found." );

  }
}
