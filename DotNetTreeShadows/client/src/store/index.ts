import { configureStore } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import logger from './middleware/logger'
import rootReducer from './rootReducer';


export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}


export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({reducer:rootReducer, middleware:getDefaultMiddleware => getDefaultMiddleware().concat(logger)});

export default store;
