import {combineReducers} from "redux";
import authReducer from "./authSlice.ts";
import dashboardReducer from "./dashboardSlice.ts";

export const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer
});

export type rootReducerState = ReturnType<typeof rootReducer>