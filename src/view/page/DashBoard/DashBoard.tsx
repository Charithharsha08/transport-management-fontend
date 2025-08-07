import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store.ts";
import { getUserFromToken } from "../../../auth/auth.ts";
import { setCredentials } from "../../../slices/authSlice.ts";
import { getAllData } from "../../../slices/dashboardSlice.ts";
import { DashboardCard } from "../../common/DashboardCard/DashboardCard.tsx";
import { getAllUsers } from "../../../slices/UserSlices.ts";
import type { UserData } from "../../../Model/userData.ts";
import { backendApi } from "../../../api.ts";

export function Dashboard() {
    const dashboard = useSelector((state: RootState) => state.dashboard);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const userData = getUserFromToken(accessToken);
            dispatch(
                setCredentials({
                    user: userData,
                    role: userData.role,
                    token: accessToken,
                })
            );
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllData());
        dispatch(getAllUsers()).then((response) => {
            if (response.payload) {
                setUserData(response.payload);
            }
        });
    }, [dispatch]);

    const handleDelete = (user_id: string) => async () => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                await backendApi.delete(`/api/v1/users/delete/${user_id}`);
                dispatch(getAllUsers()); // refresh user list
            } catch (err) {
                alert("Failed to delete user");
                console.error(err);
            }
        }
    };

    if (dashboard.loading) {
        return <div className="text-center p-8 text-lg">Loading dashboard...</div>;
    }

    if (dashboard.error) {
        console.log("error", dashboard.error);
        return <div className="text-center p-8 text-red-600">Failed to load data</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <DashboardCard label="Total Trips" value={dashboard.data?.totalTrips || 0} />
                <DashboardCard label="Completed Trips" value={dashboard.data?.completedTrips || 0} />
                <DashboardCard label="Bookings" value={dashboard.data?.totalBookings || 0} />
                <DashboardCard label="Users" value={dashboard.data?.totalUsers || 0} />
                <DashboardCard label="Drivers" value={dashboard.data?.totalDrivers || 0} />
                <DashboardCard label="Customers" value={dashboard.data?.totalCustomers || 0} />
                <DashboardCard label="Vehicles" value={dashboard.data?.totalVehicles || 0} />
                <DashboardCard label="Revenue" value={`Rs. ${dashboard.data?.totalRevenue || 0}`} />
            </div>

            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse shadow rounded bg-white">
                    <thead>
                    <tr className="bg-blue-600 text-white text-left">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {user.list.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2 capitalize">{user.role}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={handleDelete(user._id || "")}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
