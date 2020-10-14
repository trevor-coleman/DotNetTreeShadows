import {Dispatch} from "@reduxjs/toolkit";
import Api from "../api/api";
import {RootState} from "./store";

export interface ExtraInfo {
  state?: RootState
  dispatch?: Dispatch
  extra: {
    api: Api
  }
}
