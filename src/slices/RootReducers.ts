import {combineReducers} from "redux";
import authReducer from "./authSlice.ts";
import dashboardReducer from "./dashboardSlice.ts";
import driverReducer from "./driverSlices.ts";

export const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    driver: driverReducer
});

export type rootReducerState = ReturnType<typeof rootReducer>