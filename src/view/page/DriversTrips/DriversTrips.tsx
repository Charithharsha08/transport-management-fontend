import type {UserData} from "../../../Model/userData.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {backendApi} from "../../../api.ts";
import {useEffect, useState} from "react";

export function DriversTrips() {
    const [user, setUser] = useState<UserData | null>(null);
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const accessToken: string | null = localStorage.getItem('accessToken');

        if (accessToken !== null) {
            const decodedUser: UserData = getUserFromToken(accessToken);
            setUser(decodedUser);
        }
    }, []);

    useEffect(() => {
        if (user?._id) {
            backendApi.get(`api/v1/trips/find-by-driver/${user._id}`)
                .then(response => {
                    console.log(response.data);
                    setTrips(response.data);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [user]);

    console.log(trips);

    return (
        <div>
            <h1>Driver's Trips</h1>
            <ul>
               {/* {trips.map((trip, index) => (
                    <li key={index}>
                        {trip.startLocation} → {trip.endLocation} on {trip.date}
                    </li>
                ))}*/}
            </ul>
        </div>
    );
}
