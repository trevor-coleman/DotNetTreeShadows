using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class GameDto {
        public string[] TurnOrder { get; set; } = { };
        public string FirstPlayer { get; set; } = "";
        [BsonDictionaryOptions(DictionaryRepresentation.Document)]
        public Dictionary<string, uint> PlayerBoards { get; set; } = new Dictionary<string, uint>();
        public int CurrentTurn { get; set; } = 0;
        public int Revolution { get; set; } = 0;
        public int Round { get; set; } = 0;
        public int[] ScoreTokenStacks { get; set; } = { 8, 8, 5, 3 };
        public BoardDto Board { get; set; } = new BoardDto();
        public HexCoordinates[] TilesActiveThisTurn { get; set; } = { };
        public bool LongGame { get; set; }
        public bool PreventActionsInShadow { get; set; }
        public bool RandomizeTurnOrder { get; set; }
    }
}
