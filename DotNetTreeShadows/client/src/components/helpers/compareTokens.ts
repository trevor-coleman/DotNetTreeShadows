import { ScoringToken } from "../../store/game/types/scoringToken";

export const compareTokens = (a: ScoringToken,
                              b: ScoringToken): number => a.leaves == b.leaves
                                                          ? b.points - a.points
                                                          : b.leaves - a.leaves;
