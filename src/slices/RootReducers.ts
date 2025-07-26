import {combineReducers} from "redux";
import authReducer from "./authSlice.ts";

export const rootReducer = combineReducers({
    auth: authReducer
});

export type rootReducerState = ReturnType<typeof rootReducer>