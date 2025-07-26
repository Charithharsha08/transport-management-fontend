import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {setCredentials} from "../../../slices/authSlice.ts";
import {getAllData} from "../../../slices/dashboardSlice.ts";

export function Dashboard() {

    const dashboard = useSelector((state: RootState) => state.dashboard);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const userData = getUserFromToken(accessToken);
            dispatch(setCredentials({
                user: userData,
                role: userData.role,
                token: accessToken
            }));
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllData());
    }, [dispatch]);

    if (dashboard.loading) {
        return <div className="text-center p-8 text-lg">Loading dashboard...</div>;
    }

    if (dashboard.error) {
        return <div className="text-center p-8 text-red-600">Failed to load data</div>;
    }

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <Card label="Total Trips" value={dashboard.data?.totalTrips || 0}/>
                    <Card label="Completed Trips" value={dashboard.data?.completedTrips || 0}/>
                    <Card label="Bookings" value={dashboard.data?.totalBookings || 0}/>
                    <Card label="Users" value={dashboard.data?.totalUsers || 0}/>
                    <Card label="Drivers" value={dashboard.data.totalDrivers || 0}/>
                    <Card label="Customers" value={dashboard.data?.totalCustomers || 0}/>
                    <Card label="Vehicles" value={dashboard.data?.totalVehicles || 0}/>
                    <Card label="Revenue" value={`Rs. ${dashboard.data.totalRevenue || 0}`}/>
                </div>
            </div>
        </div>
    );
}


function Card({label, value}: { label: string; value: number | string }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-gray-600">{label}</h3>
            <p className="text-2xl font-bold text-blue-700 mt-2">{value}</p>
        </div>
    );
}

