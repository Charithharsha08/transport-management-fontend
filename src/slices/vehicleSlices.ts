import type {VehicleData} from "../Model/vehicleData.ts";
import {backendApi} from "../api.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

interface vehicleState {
    list: VehicleData[]
    error: string | null | undefined
}

const initialState: vehicleState = {
    list: [],
    error: null,
};

export const getAllVehicles = createAsyncThunk(
    'vehicle/getAllVehicles',
    async () => {
        const response = await backendApi.get('api/v1/vehicles/all');
        return await response.data;
    }
);

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllVehicles.pending, (state) => {
                alert(" Vehicles data are still loading please wait");
                state.error = null;
            })

            .addCase(getAllVehicles.fulfilled, (state, action) => {
            state.list = action.payload;
            })

            .addCase(getAllVehicles.rejected, (state, action) => {
            state.error = action.error.message ?? 'Unknown error';
            alert("Error while loading vehicles data" + state.error);
            });
    },
});

export default vehicleSlice.reducer;