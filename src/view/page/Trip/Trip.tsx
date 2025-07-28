import {useEffect, useState, type ChangeEvent, useRef} from "react";
import {backendApi} from "../../../api";
import type {UserData} from "../../../Model/userData"; // driver list
import type {VehicleData} from "../../../Model/vehicleData";
import type {PopulatedTripDTO, TripData} from "../../../Model/trip.data.ts";

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


    const [drivers, setDrivers] = useState<UserData[]>([]);
    const [vehicles, setVehicles] = useState<VehicleData[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const formRef = useRef<HTMLDivElement | null>(null);

    const role = localStorage.getItem("role");

    useEffect(() => {
        backendApi.get("/api/v1/users/all?role=driver").then(res => setDrivers(res.data));
        backendApi.get("/api/v1/vehicles/all").then(res => setVehicles(res.data));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setTripData(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    const handleEdit = (trip: PopulatedTripDTO) => {
        setTripData({
            driverId: trip.driverId?._id || "",
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

        formRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleCancel = async (tripId: string) => {
        try {
            await backendApi.put(`/api/v1/trips/${tripId}`, { status: "Cancelled" });
            setTrips(prev => prev.map(t => t._id === tripId ? { ...t, status: "Cancelled" } : t));
        } catch (err) {
            alert("Failed to cancel trip");
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isUpdating && selectedTripId) {
                await backendApi.put(`/api/v1/trips/update/${selectedTripId}`, tripData);
                alert("Trip updated successfully");
            } else {
                const { status, ...newTripData } = tripData;
                await backendApi.post("/api/v1/trips/save", newTripData);
                alert("Trip added successfully");
            }

            // Reset everything
            setTripData({ driverId: "", vehicleId: "", startLocation: "", endLocation: "", date: "", distance: "", price: 0 });
            setIsUpdating(false);
            setSelectedTripId(null);
        } catch {
            alert(isUpdating ? "Failed to update trip" : "Error adding trip");
        }
    };


    const [trips, setTrips] = useState<PopulatedTripDTO[]>([]);

    useEffect(() => {
        backendApi.get('/api/v1/trips/all')
            .then(response => {
                console.log('trips', response.data);
                setTrips(response.data);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
            });
    }, []);


    return (
        <>
            {role === "admin" && (
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                        {isUpdating ? "Update Trip" : "Add Trip"}
                    </h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium">Driver</label>
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Vehicle</label>
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


                        <div ref={formRef} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
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

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Bookings</h2>
                <table className="w-full border-collapse bg-white shadow rounded">
                    <thead>
                    <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left">Driver</th>
                        <th className="p-3 text-left">Vehicle</th>
                        <th className="p-3 text-left">Route</th>
                        <th className="p-3 text-left">Trip Date</th>
                        <th className="p-3 text-left">Booking Date</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Notes</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trips.map((trip, index) => (
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
                                    onClick={() => handleCancel(trip._id!)}
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

        </>
    );
}
