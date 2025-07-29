import type {UserData} from "../../../Model/userData.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


type driverCardProps = {
    data: UserData;
}


export function DriverCard({data}: driverCardProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const navigate = useNavigate();

/*
    const dispatch = useDispatch<AppDispatch>();
*/


    useEffect(() => {
        if (data.profileImage) {
            setImageUrl(`http://localhost:3000/uploads/profile/${data.profileImage}`);
        }
    }, [data]);

    function handleBookNow() {
       navigate('/trips');
    }


    return (
        <div
            className="w-[220px] h-auto rounded-2xl shadow-md border border-gray-200 bg-white p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col items-center">
                <img
                    className="h-[100px] w-[100px] object-cover rounded-full shadow-sm"
                    src={imageUrl || undefined}
                    alt={data.name}
                />
                <h3 className="mt-3 text-sm font-bold text-gray-800">{data.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1">Professional Driver</p>

                <button
                    onClick={handleBookNow}
                    className="mt-4 w-full py-[6px] bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors duration-200"
                >
                    Book Now
                </button>
            </div>
        </div>

    )
}