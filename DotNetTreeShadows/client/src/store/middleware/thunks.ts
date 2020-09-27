import {Action} from 'redux';
import { setUserProfile, fetchUserProfile } from '../user/actions';
import {RootState} from '../index';
import {ThunkAction} from 'redux-thunk';

import axios, { AxiosResponse } from 'axios';
import { Profile, KnownUserAction } from '../user/types';
import { getFriendsAsync } from '../friends/thunks';

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >





