import {
    configureStore,
    createImmutableStateInvariantMiddleware,
    createSerializableStateInvariantMiddleware
} from '@reduxjs/toolkit';
import {useSelector, TypedUseSelectorHook} from 'react-redux'
import logger from './middleware/logger'
import rootReducer from './rootReducer';
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";


export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}

const persistConfig = {
    key: 'root',
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: {ignoredActions: ["persist/PERSIST"]}})
}); //.concat(logger)});
const persistor = persistStore(store);

export default {
    store,
    persistor
};
