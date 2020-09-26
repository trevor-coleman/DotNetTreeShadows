import { combineReducers } from '@reduxjs/toolkit';
import { systemReducer } from './system/reducers';
import { userReducer } from './user/reducers';
import { friendsReducer } from './friends/reducers';

const rootReducer = combineReducers({
    system:systemReducer,
    user: userReducer,
    friends: friendsReducer,
})

export default rootReducer;
