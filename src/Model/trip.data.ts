export interface TripData {
    _id?: string;
    driverId: string;
    vehicleId: string;
    startLocation: string;
    endLocation: string;
    date: string;
    distance: string;
    price: number;
    status?: string;
}

export interface PopulatedTripDTO {
    _id?: string;
    driverId: {
        _id: string;
        name: string;
        email: string;
    };
    vehicleId: {
        _id: string;
        brand: string;
        model: string;
        name: string;
    };
    customerId?: {
        _id: string;
        name: string;
        email: string;
    };
    startLocation: string;
    endLocation: string;
    date: string; // <-- updated
    createdAt?: string; // <-- updated
    status?: string;
    distance?: string | null;
    price?: number | null;
}
