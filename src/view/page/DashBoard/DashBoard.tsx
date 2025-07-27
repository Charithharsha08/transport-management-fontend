import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {setCredentials} from "../../../slices/authSlice.ts";
import {getAllData} from "../../../slices/dashboardSlice.ts";
import {DashboardCard} from "../../common/DashboardCard/DashboardCard.tsx";

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
        console.log("error", dashboard.error);
        return <div className="text-center p-8 text-red-600">Failed to load data</div>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">
                <DashboardCard label="Total Trips" value={dashboard.data?.totalTrips || 0}/>
                <DashboardCard label="Completed Trips" value={dashboard.data?.completedTrips || 0}/>
                <DashboardCard label="Bookings" value={dashboard.data?.totalBookings || 0}/>
                <DashboardCard label="Users" value={dashboard.data?.totalUsers || 0}/>
                <DashboardCard label="Drivers" value={dashboard.data?.totalDrivers || 0}/>
                <DashboardCard label="Customers" value={dashboard.data?.totalCustomers || 0}/>
                <DashboardCard label="Vehicles" value={dashboard.data?.totalVehicles || 0}/>
                <DashboardCard label="Revenue" value={`Rs. ${dashboard.data?.totalRevenue || 0}`}/>
            </div>
        </>
    );
}
