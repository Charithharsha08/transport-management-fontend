import {useEffect, useState, type ChangeEvent} from "react";
import {backendApi} from "../../../api";
import type {UserData} from "../../../Model/userData"; // driver list
import type {VehicleData} from "../../../Model/vehicleData";
import type {TripData} from "../../../Model/trip.data.ts";
import type {PopulatedBookingDTO} from "../../../Model/bookingData.ts";

export function Trip() {
    const [tripData, setTripData] = useState<TripData>({
        driverId: "",
        vehicleId: "",
        startLocation: "",
        endLocation: "",
        date: "",
        distance: "",
        price: 0,
    });

    const [drivers, setDrivers] = useState<UserData[]>([]);
    const [vehicles, setVehicles] = useState<VehicleData[]>([]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await backendApi.post("/api/v1/trips/save", tripData);
            if (response.status === 201 || response.status === 200) {
                alert("Trip added successfully.");
                setTripData({
                    driverId: "",
                    vehicleId: "",
                    startLocation: "",
                    endLocation: "",
                    date: "",
                    distance: "",
                    price: 0,
                });
            }
        } catch (err) {
            alert("Error adding trip.");
        }
    };

    const [bookings, setBookings] = useState<PopulatedBookingDTO[]>([]);

    useEffect(() => {
        backendApi.get('/api/v1/booking/all')
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
            });
    }, []);

    return (
        <>
            {role === "admin" && (
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Add Trip</h1>
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

                        <div className="col-span-full text-right">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Add Trip
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
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Email</th>
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
                    {bookings.map((booking, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-3">{booking.customerId?.name || 'N/A'}</td>
                            <td className="p-3">{booking.customerId?.email || 'N/A'}</td>
                            <td className="p-3">{booking.tripId?.driverId?.name || 'N/A'}</td>
                            <td className="p-3">
                                {booking.tripId?.vehicleId
                                    ? `${booking.tripId.vehicleId.brand} ${booking.tripId.vehicleId.model} (${booking.tripId.vehicleId.name})`
                                    : 'N/A'}
                            </td>
                            <td className="p-3">
                                {booking.tripId
                                    ? `${booking.tripId.startLocation} → ${booking.tripId.endLocation}`
                                    : 'N/A'}
                            </td>
                            <td className="p-3">
                                {booking.tripId?.date
                                    ? new Date(booking.tripId.date).toLocaleDateString()
                                    : 'N/A'}
                            </td>
                            <td className="p-3">
                                {booking.bookingDate
                                    ? new Date(booking.bookingDate).toLocaleDateString()
                                    : 'N/A'}
                            </td>
                            <td className="p-3">{booking.status}</td>
                            <td className="p-3">{booking.notes || '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </>
    );
}
