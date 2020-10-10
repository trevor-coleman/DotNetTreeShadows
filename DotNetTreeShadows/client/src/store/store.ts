import Api from "../api/api";
import {
    Action,
    AnyAction,
    CombinedState,
    configureStore, Dispatch,
    EnhancedStore,
    Middleware,
    ThunkAction,
    ThunkDispatch
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
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

export interface ExtraInfo {
    state?: RootState
    dispatch?: Dispatch
    extra: {
        api: Api
    }
    rejectValue?: unknown
}

const getToken = (state: RootState): string | null => {
    return state.auth.token
}

const initStore = () => {
    let store: any;
    let thing = "";
    const api: Api = Api.Create(
        () => {
            return getToken(store?.getState())
        },
        "https://localhost:5001/api/"
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
