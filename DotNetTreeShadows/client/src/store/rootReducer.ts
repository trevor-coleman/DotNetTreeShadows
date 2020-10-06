import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/reducer'
import invitationsReducer from './invitations/reducer'
import profileReducer from './profile/reducer'
import boardReducer from './board/reducer'

const rootReducer = combineReducers({
    auth: authReducer,
    invitations: invitationsReducer,
    profile: profileReducer,
    board: boardReducer,
})

export default rootReducer;
