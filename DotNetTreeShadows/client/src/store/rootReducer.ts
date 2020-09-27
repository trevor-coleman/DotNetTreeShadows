import { combineReducers } from '@reduxjs/toolkit';
import { systemReducer } from './system/reducers';
import { userReducer } from './user/reducers';
import { friendsReducer } from './friends/reducers';
import { invitationsReducer } from './invitations/reducers';
import { sessionReducer } from './sessions/reducers';

const rootReducer = combineReducers({
    system:systemReducer,
    user: userReducer,
    friends: friendsReducer,
    invitations: invitationsReducer,
    session: sessionReducer,
})

export default rootReducer;
