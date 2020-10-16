import Api from "../api/api";
import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import {PersistPartial} from "redux-persist/lib/persistReducer";


const persistConfig = {
    key: 'root',
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export type RootState = ReturnType<typeof rootReducer>;

const getToken = (state: RootState): string | null => {
    return state.auth.token
}

console.log("process.env.TREE_SHADOWS_API_URL", process.env.TREE_SHADOWS_API_URL)

const initStore = () => {
    let store: any;
    let thing = "";
    const api: Api = Api.Create(
        () => {
            return getToken(store?.getState())
        },
      process.env.TREE_SHADOWS_API_URL ?? "/api/"
    );
    store = configureStore({
        reducer: persistedReducer,
        middleware: getDefaultMiddleware => [...getDefaultMiddleware({
            thunk: {
                extraArgument: {api}
            },
            serializableCheck: {ignoredActions: ["persist/PERSIST"]}
        })]
    }); //.concat(logger)});
    const persistor = persistStore(store);

    return {
        store,
        persistor,
        api
    }
}

export type AppThunk = ThunkAction<void, RootState, Api, Action<string>>

const enhancedStore = initStore();
const {store} = enhancedStore

export default enhancedStore;
