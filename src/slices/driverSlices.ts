import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {backendApi} from "../api.ts";
import type { UserData } from "../Model/userData.ts";



interface driverState {
    list: UserData[],
    error: string | null | undefined,
}

const initialState: driverState = {
    list: [],
    error: null,
};

export const getAllDrivers = createAsyncThunk(
    'driver/getAllDrivers',
    async () => {
        const response = await backendApi.get('api/v1/users/find-by-role/driver');
        return await response.data;
    }
);

const driverSlice = createSlice({
    name: 'driver',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllDrivers.pending, (state) => {
                alert(" Drivers data are still loading please wait");
                state.error = null;
            })
            .addCase(getAllDrivers.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(getAllDrivers.rejected, (state, action) => {
                state.error = action.error.message ?? 'Unknown error';
                alert("Error while loading drivers data" + state.error);
            });
    },
});

export default driverSlice.reducer;

