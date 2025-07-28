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
