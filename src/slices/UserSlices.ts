import type {UserData} from "../Model/userData.ts";
import {backendApi} from "../api.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

interface UserState {
    list: UserData[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    list: [],
    loading: false,
    error: null,
};

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async () => {
        const response = await backendApi.get('api/v1/users/all');
        return await response.data;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch users';
            });
    },
});

export default userSlice.reducer;