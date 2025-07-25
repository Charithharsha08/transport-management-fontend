import {useEffect, useState} from "react";

export function Driver() {
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        // axios.get(...) to fetch drivers by role=driver
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Drivers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drivers.map((d, index) => (
                    <div key={index} className="bg-white p-4 shadow rounded">
                        <h3 className="text-xl font-semibold">{"d.name"}</h3>
                        <p className="text-gray-600">{"d.email"}</p>
                        <p className="text-gray-500 text-sm">Role: {"d.role"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}