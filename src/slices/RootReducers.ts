import {combineReducers} from "redux";
import authReducer from "./authSlice.ts";
import dashboardReducer from "./dashboardSlice.ts";
import driverReducer from "./driverSlices.ts";
import vehicleReducer from "./vehicleSlices.ts";
import tripReducer from "./TripSlice.ts";
import userReducer from "./UserSlices.ts";

export const rootReducer = combineReducers({
    auth: authReducer,
    dashboard: dashboardReducer,
    driver: driverReducer,
    vehicle: vehicleReducer,
    trip: tripReducer,
    user: userReducer
});

export type rootReducerState = ReturnType<typeof rootReducer>