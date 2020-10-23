import {PieceType} from "../../board/types/pieceType";
import {GameActionType} from "../actions";
import gameActions from "../../../gamehub/gameActions";
import enhancedStore from "../../store";

const {store} = enhancedStore;

export default async function handlePlayerBoardClick(pieceType: PieceType) {
  console.log(`handleClick - ${pieceType} - ${store.getState().currentActionType}`)
  if (store.getState().game.currentActionType != GameActionType.Buy) return;

  await gameActions.buy(pieceType);


}
