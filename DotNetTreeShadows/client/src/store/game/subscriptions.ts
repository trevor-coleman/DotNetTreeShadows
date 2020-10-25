import enhancedStore , { RootState } from '../store';
import { GameActionType } from './actions';
import { clearCurrentAction } from "./reducer";
import { useTypedSelector } from '../index';
const {store} = enhancedStore;


let currentValue;

const selectedState= (state:RootState) => {
  const playerId = state.profile.id;
  const playerBoard = state.playerBoards[playerId] ?? 0;
  const actionType =  state.game.currentActionType;

  return {
    actionType,
    playerBoard,
  }
}

function autoCloseBuyMenu() {
  const state=selectedState(store.getState());
  if(state.actionType !== GameActionType.Buy) return;
  if(state.playerBoard.light === 0 || state.playerBoard.light < state.playerBoard.lowestPrice) {
    store.dispatch(clearCurrentAction())
  }
};

let unsubscribe: ()=>any;
export const subscribeAutoCloseBuyMenu = ()=>{
  unsubscribe = store.subscribe(autoCloseBuyMenu);
}

export const unsubscribeAutoCloseBuyMenu=()=>{
  unsubscribe();
}

