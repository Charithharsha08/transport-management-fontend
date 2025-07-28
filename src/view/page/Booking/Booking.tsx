import { useEffect, useState } from "react";
import { backendApi } from "../../../api.ts";
import type { PopulatedBookingDTO } from "../../../Model/bookingData.ts";

export function Booking() {
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
    );
}
