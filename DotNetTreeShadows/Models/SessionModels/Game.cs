using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;

namespace dotnet_tree_shadows.Models.SessionModels {
  public class Game {
    public Dictionary<string, BitwisePlayerBoard> PlayerBoards { get; set; } =
      new Dictionary<string, BitwisePlayerBoard>();
    public List<string> TurnOrder { get; set; } = new List<string>();
    public Dictionary<string, TreeType> PlayerTreeTypes = new Dictionary<string, TreeType>();
    public string FirstPlayer { get; set; } = "";
    public int CurrentTurn { get; set; } = 0;
    public string CurrentPlayer {
      get => TurnOrder[CurrentTurn];
    }

    public int Revolution { get; set; } = 0;
    public int Round { get; set; } = 0;
    public Dictionary<string, Scoring.PlayerScore> PlayerScores = new Dictionary<string, Scoring.PlayerScore>();
    public Scoring.Stacks ScoreTokenStacks { get; set; } = new Scoring.Stacks();
    public List<HexCoordinates> TilesActiveThisTurn { get; set; } = new List<HexCoordinates>();

    public Board Board { get; } = Board.New();

    public Game () { }

    public Game (string hostId, GameOptions? gameOptions = null) {
      AddPlayer( hostId );
      Host = hostId;
      FirstPlayer = hostId;
      ScoreTokenStacks = new Scoring.Stacks();
      GameOptions options = gameOptions ?? GameOptions.Default;
      LongGame = options.LongGame;
      RandomizeTurnOrder = options.RandomizeTurnOrder;
      PreventActionsInShadow = options.PreventActionsInShadow;
    }

    public Game (GameDto dto) {
      TurnOrder = dto.TurnOrder.ToList();
      FirstPlayer = dto.FirstPlayer;
      PlayerBoards = new Dictionary<string, BitwisePlayerBoard>();
      foreach ( (string player, uint boardCode) in dto.PlayerBoards ) {
        PlayerBoards.Add( player, new BitwisePlayerBoard(boardCode) );
      }
      CurrentTurn = dto.CurrentTurn;
      Revolution = dto.Revolution;
      Round = dto.Round;
      ScoreTokenStacks = new Scoring.Stacks(dto.ScoreTokenStacks);
      Board = new Board(dto.Board);
      TilesActiveThisTurn = TilesActiveThisTurn;
      LongGame = LongGame;
      PreventActionsInShadow = PreventActionsInShadow;
      RandomizeTurnOrder = RandomizeTurnOrder;
    }

    public void Start () {
      if(RandomizeTurnOrder) RandomizeTurns();
      Status = GameStatus.InProgress;
    }

    private void RandomizeTurns () {
      Random random = new Random();
      int n = TurnOrder.Count;
      string[] array = TurnOrder.ToArray();
      while ( n > 1 ) {
        int k = random.Next( n-- );
        string temp = array[n];
        array[n] = array[k];
        array[k] = temp;
      }

      TurnOrder = array.ToList();
      FirstPlayer = TurnOrder[0];
    }

    public int LengthOfGame {
      get =>
        LongGame
          ? 4
          : 3;
    }

    [Serializable]
    public struct GameOptions {
      public bool LongGame { get; set; }
      public bool PreventActionsInShadow { get; set; }
      public bool RandomizeTurnOrder { get; set; }

      public GameOptions (bool preventActionsInShadow, bool longGame, bool randomizeTurnOrder) {
        PreventActionsInShadow = preventActionsInShadow;
        LongGame = longGame;
        RandomizeTurnOrder = randomizeTurnOrder;
      }

      public static GameOptions Default {
        get => new GameOptions { LongGame = false, PreventActionsInShadow = false, RandomizeTurnOrder = true };
      }
    }

    public void AddPlayerBoard (string playerId) { PlayerBoards.Add( playerId, new BitwisePlayerBoard() ); }

    public GameDto Dto () {
      Dictionary<string, uint> playerBoardDtos = new Dictionary<string, uint>();
      // ReSharper disable once ForeachCanBeConvertedToQueryUsingAnotherGetEnumerator
      foreach ( (string playerId, BitwisePlayerBoard playerBoard) in PlayerBoards ) {
        playerBoardDtos.Add( playerId, playerBoard.BoardCode );
      }

      return new GameDto {
        TurnOrder = TurnOrder.ToArray(),
        FirstPlayer = FirstPlayer,
        PlayerBoards = playerBoardDtos,
        CurrentTurn = CurrentTurn,
        Revolution = Revolution,
        Round = Round,
        ScoreTokenStacks = ScoreTokenStacks.Remaining,
        Board = Board.Dto(),
        LongGame = LongGame,
        PreventActionsInShadow = PreventActionsInShadow,
        RandomizeTurnOrder = RandomizeTurnOrder,
        TilesActiveThisTurn = TilesActiveThisTurn.ToArray(),
      };
    }

    public bool RandomizeTurnOrder { get; set; }

    public bool PreventActionsInShadow { get; set; }

    public bool LongGame { get; set; }

    public void AddPlayer (string playerId) {
      TurnOrder.Add( playerId );
      AddPlayerBoard( playerId );
      AddPlayerScore( playerId );
    }

    private void AddPlayerScore (string playerId) => PlayerScores.TryAdd( playerId, new Scoring.PlayerScore() );
    public GameStatus Status { get; set; } = GameStatus.Preparing;
    public string Host { get; set; }

    public enum GameStatus {
      Preparing,
      PlacingFirstTrees,
      InProgress,
      Ended
    }

    public void End () { this.Status = GameStatus.Ended; }
  }

  
}
