import {useEffect, useState} from "react";

export function Booking() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // axios.get(...) to fetch bookings
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Bookings</h2>
            <table className="w-full border-collapse bg-white shadow rounded">
                <thead>
                <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Trip ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Notes</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((b, index) => (
                    <tr key={index} className="border-b">
                        <td className="p-3">{"b.customerId"}</td>
                        <td className="p-3">{"b.tripId"}</td>
                        <td className="p-3">{"new Date(b.bookingDate).toLocaleDateString()"}</td>
                        <td className="p-3">{"b.status"}</td>
                        <td className="p-3">{"b.notes"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}