import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {PopulatedTripDTO} from "../Model/trip.data.ts";
import {backendApi} from "../api.ts";

interface TripState {
    list: PopulatedTripDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: TripState = {
    list: [],
    loading: false,
    error: null
};

export const getAllTrips = createAsyncThunk(
    "trip/getAllTrips",
    async (_, { rejectWithValue }) => {
        try {
            const response = await backendApi.get("/api/v1/trips/all");
            return response.data as PopulatedTripDTO[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch trips");
        }
    }
);

const tripSlice = createSlice({
    name: "trip",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTrips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTrips.fulfilled, (state, action: PayloadAction<PopulatedTripDTO[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAllTrips.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    }
});

export default tripSlice.reducer;
