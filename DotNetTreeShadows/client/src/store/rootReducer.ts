import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/reducer'
import invitationsReducer from './invitations/reducer'
import profileReducer from './profile/reducer'
import boardReducer from './board/reducer'
import sessionReducer from './session/reducer'
import gameReducer from './game/reducer'

const rootReducer = combineReducers({
    auth: authReducer,
    invitations: invitationsReducer,
    profile: profileReducer,
    board: boardReducer,
    game: gameReducer,
    session: sessionReducer,
})

export default rootReducer;
