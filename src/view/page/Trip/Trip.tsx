import {useEffect, useState, type ChangeEvent, useRef} from "react";
import {backendApi} from "../../../api";
import type {PopulatedTripDTO, TripData} from "../../../Model/trip.data.ts";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {getAllDrivers} from "../../../slices/driverSlices.ts";
import {getAllVehicles} from "../../../slices/vehicleSlices.ts";
import {getAllTrips} from "../../../slices/TripSlice.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {getUserByEmail} from "../../../slices/UserSlices.ts";
import type {UserData} from "../../../Model/userData.ts";

export function Trip() {
    const [tripData, setTripData] = useState<TripData>({
        driverId: "",
        vehicleId: "",
        startLocation: "",
        endLocation: "",
        date: "",
        distance: "",
        price: 0,
        status: "Pending",
    });

    const dispatch = useDispatch<AppDispatch>();
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);

    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const [user, setUser] = useState<UserData | null>(null);

    const driverState = useSelector((state: RootState) => state.driver);
    const vehicleState = useSelector((state: RootState) => state.vehicle);
    const tripState = useSelector((state: RootState) => state.trip);

    const drivers = driverState.list;
    const vehicles = vehicleState.list;
    const trips = tripState.list;

    console.log("user", user);
    console.log("user?._id:", user?._id);
    console.log("trip.driverId._id:", trips.map(t => t.driverId?._id));

    const [localTrips, setLocalTrips] = useState<PopulatedTripDTO[]>([]);

    useEffect(() => {
        if (trips.length > 0) {
            setLocalTrips(trips);
        }
    }, [trips]);

    const pendingTrips = localTrips.filter(
        (trip) => trip.status === "Pending" && trip.driverId?._id === user?._id
    );

    const processingTrips = localTrips.filter(
        (trip) => trip.status === "Processing" && trip.driverId?._id === user?._id
    );

    useEffect(() => {
        if (accessToken) {
            const email = getUserFromToken(accessToken)?.email;
            dispatch(getUserByEmail(email))
                .unwrap()
                .then((userData) => {
                    console.log("Fetched user:", userData);
                    setUser(userData);
                },)
                .catch((error) => {
                    console.error("Error fetching user:", error);
                });
            dispatch(getAllDrivers());
            dispatch(getAllVehicles());
            dispatch(getAllTrips());
        }
    }, [dispatch]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setTripData(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleEdit = (trip: PopulatedTripDTO) => {
        if (driverState.loading) {
            alert("Please wait until drivers are loaded.");
            return;
        }

        setTripData({
            driverId: trip.driverId?._id ?? "",
            vehicleId: trip.vehicleId?._id || "",
            startLocation: trip.startLocation,
            endLocation: trip.endLocation,
            date: trip.date.slice(0, 10),
            distance: trip.distance || "",
            price: trip.price || 0,
            status: trip.status || "Pending",
        });
        setSelectedTripId(trip._id || null);
        setIsUpdating(true);

        formRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const handleStatusUpdateUI = async (tripId: string, newStatus: string) => {
        try {
            await backendApi.put(`/api/v1/trips/status/${tripId}`, { status: newStatus });

            setLocalTrips(prev =>
                prev.map(trip =>
                    trip._id === tripId
                        ? newStatus === "Completed"
                            ? null // Remove completed trip
                            : { ...trip, status: newStatus }
                        : trip
                ).filter(Boolean) as PopulatedTripDTO[]
            );
        } catch (err) {
            alert(`Failed to update trip to ${newStatus}`);
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isUpdating && selectedTripId) {
                await backendApi.put(`/api/v1/trips/update/${selectedTripId}`, tripData);
                alert("Trip updated successfully");
                window.location.reload();
            } else {
                const {status, ...newTripData} = tripData;
                await backendApi.post("/api/v1/trips/save", newTripData);
                alert("Trip added successfully");
            }

            setTripData({
                driverId: "",
                vehicleId: "",
                startLocation: "",
                endLocation: "",
                date: "",
                distance: "",
                price: 0,
                status: "Pending"
            });
            setIsUpdating(false);
            setSelectedTripId(null);
        } catch {
            alert(isUpdating ? "Failed to update trip" : "Error adding trip");
        }
    };


    return (
        <>
            {role !== "driver" && (
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                        {isUpdating ? "Update Trip" : "Add Trip"}
                    </h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Driver</label>
                            {driverState.loading ? (
                                <p>Loading drivers...</p>
                            ) : driverState.error ? (
                                <p className="text-red-500">{driverState.error}</p>
                            ) : (
                                <select
                                    name="driverId"
                                    value={tripData.driverId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                    required
                                >
                                    <option value="">Select Driver</option>
                                    {drivers.map(driver => (
                                        <option key={driver._id} value={driver._id}>
                                            {driver.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Vehicle</label>
                            {vehicleState.loading ? (
                                <p>Loading vehicles...</p>
                            ) : vehicleState.error ? (
                                <p className="text-red-500">{vehicleState.error}</p>
                            ) : (
                                <select
                                    name="vehicleId"
                                    value={tripData.vehicleId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                    required
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map(vehicle => (
                                        <option key={vehicle._id} value={vehicle._id}>
                                            {vehicle.brand} - {vehicle.model}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Start Location</label>
                            <input
                                type="text"
                                name="startLocation"
                                value={tripData.startLocation}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">End Location</label>
                            <input
                                type="text"
                                name="endLocation"
                                value={tripData.endLocation}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={tripData.date}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Distance (km)</label>
                            <input
                                type="text"
                                name="distance"
                                value={tripData.distance}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Price (LKR)</label>
                            <input
                                type="number"
                                name="price"
                                value={tripData.price}
                                onChange={handleChange}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                            />
                        </div>

                        {isUpdating && (
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    name="status"
                                    value={tripData.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        )}

                        <div ref={formRef} className="col-span-full">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                {isUpdating ? "Update Trip" : "Add Trip"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {role === "admin" && (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Trips</h2>
                    <table className="w-full border-collapse bg-white shadow rounded">
                        <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="p-3 text-left">Driver</th>
                            <th className="p-3 text-left">Vehicle</th>
                            <th className="p-3 text-left">Route</th>
                            <th className="p-3 text-left">Trip Date</th>
                            <th className="p-3 text-left">Booking Date</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tripState.loading || tripState.error ? (
                            <tr>
                                <td colSpan={7}>
                                    {tripState.loading ? (
                                        <p>Loading trips...</p>
                                    ) : (
                                        <p className="text-red-500">{tripState.error}</p>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            trips.map(trip => (
                                <tr key={trip._id} className="border-b">
                                    <td className="p-3">{trip.driverId?.name}</td>
                                    <td className="p-3">{trip.vehicleId?.brand} {trip.vehicleId?.model}</td>
                                    <td className="p-3">{trip.startLocation} → {trip.endLocation}</td>
                                    <td className="p-3">{new Date(trip.date).toLocaleDateString()}</td>
                                    <td className="p-3">{trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : "-"}</td>
                                    <td className="p-3">{trip.status}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleEdit(trip)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdateUI(trip._id!, "Cancelled")}
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {role === "driver" && (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Your Trips</h2>

                    {pendingTrips.length === 0 && processingTrips.length === 0 && (
                        <p className="text-center text-gray-600">You don’t have any trips at the moment.</p>
                    )}

                    {pendingTrips.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">Pending Trips</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingTrips.map(trip => (
                                    <div key={trip._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold mb-2">{trip.startLocation} → {trip.endLocation}</h3>
                                        <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
                                        <p><strong>Distance:</strong> {trip.distance} km</p>
                                        <p><strong>Price:</strong> Rs. {trip.price}</p>
                                        <p><strong>Vehicle:</strong> {trip.vehicleId?.brand} {trip.vehicleId?.model}</p>
                                        <p className="mt-2"><strong>Status:</strong> <span className="text-blue-600">{trip.status}</span></p>

                                        <div className="flex justify-between mt-4 gap-2">
                                            <button
                                                onClick={() => handleStatusUpdateUI(trip._id!, "Cancelled")}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdateUI(trip._id!, "Processing")}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                            >
                                                Processing
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {processingTrips.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-xl font-semibold mb-2 text-gray-700">Processing Trips</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {processingTrips.map(trip => (
                                    <div key={trip._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold mb-2">{trip.startLocation} → {trip.endLocation}</h3>
                                        <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
                                        <p><strong>Distance:</strong> {trip.distance} km</p>
                                        <p><strong>Price:</strong> Rs. {trip.price}</p>
                                        <p><strong>Vehicle:</strong> {trip.vehicleId?.brand} {trip.vehicleId?.model}</p>
                                        <p className="mt-2"><strong>Status:</strong> <span className="text-yellow-600">{trip.status}</span></p>

                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={() => handleStatusUpdateUI(trip._id!, "Completed")}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Complete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}


        </>
    );
}
