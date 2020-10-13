import {AppDispatch} from "../index";
import {Session} from "./types";
import {unwrapResult} from "@reduxjs/toolkit";
import {createSession, updateSession} from "./reducer";
import {fetchProfile} from "../profile/actions";
import {fetchGame} from "../game/actions";
import {fetchBoard} from "../board/actions";
import {fetchSessionFromApi} from "./actions";
import {Board} from "../board/types/board";
import Game from "../game/types/game";

export const createSessionAndFetchProfile = () => async (dispatch: AppDispatch) => {
    const session:Session = unwrapResult(await dispatch(createSession())) as Session
    const game = unwrapResult(await dispatch(fetchGame(session.id))) as Game;
    const board = unwrapResult(await dispatch(fetchBoard(session.id))) as Board;
    dispatch(updateSession({session,game,board}))
    await dispatch(fetchProfile());
    return
};

export const fetchSession = (sessionId: string) => async (dispatch: AppDispatch) => {
    const result = await dispatch(fetchSessionFromApi(sessionId));
    const session:Session = unwrapResult(result) as Session
    const game = unwrapResult(await dispatch(fetchGame(session.id))) as Game;
    const board = unwrapResult(await dispatch(fetchBoard(session.id))) as Board;
    dispatch(updateSession({session,game,board}))
    await dispatch(fetchProfile());

};
