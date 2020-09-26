import { combineReducers } from '@reduxjs/toolkit';
import { systemReducer } from './system/reducers';
import { userReducer } from './user/reducers';

const rootReducer = combineReducers({
    system:systemReducer,
    user: userReducer,
})

export default rootReducer;
