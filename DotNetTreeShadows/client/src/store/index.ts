import {useSelector, TypedUseSelectorHook} from 'react-redux'
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
