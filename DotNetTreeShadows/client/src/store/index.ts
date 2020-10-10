import {
    configureStore,
} from '@reduxjs/toolkit';
import {useSelector, TypedUseSelectorHook} from 'react-redux'
import logger from './middleware/logger'
import rootReducer from './rootReducer';
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import Api from "../api/api";
import thunk from "redux-thunk";
import enhancedStore from './store'
import {RootState} from './store'

const {store, persistor, api} = enhancedStore;

export type AppDispatch = typeof store.dispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}

export default {
    store,
    persistor
}
