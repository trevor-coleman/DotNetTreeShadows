import {Action} from 'redux';
import {setUserProfile} from '../z_old-user/actions'
import {RootState} from '../index';
import { ThunkAction, ThunkMiddleware } from 'redux-thunk';


const logger:ThunkMiddleware = store => next => action => {
    console.group(action.type);
    console.info('dispatching', action);
    let result=next(action);
    console.log('next state', store.getState())
    console.groupEnd()
    return result;
}

export default logger;
