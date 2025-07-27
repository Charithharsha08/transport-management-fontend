import {backendApi} from "../api.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";


   export  const getAllUsers = createAsyncThunk(
        'driver/getAllDrivers',
        async () => {
            const response = await backendApi.get('api/v1/users/');
            return response.data;
        }
    );


