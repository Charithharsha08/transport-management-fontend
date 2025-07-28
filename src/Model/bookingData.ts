export interface BookingData {
    _id?: string;
    customerId:string;
    tripId: string;
    bookingDate: Date;
    status: string;
    notes?: string | null;
}

export interface PopulatedBookingDTO{
    _id?: string;
    customerId: {
        name: string;
        email: string;
    } | null;

    tripId: {
        driverId: {
            name: string;
            email: string;
        };
        vehicleId: {
            brand: string;
            model: string;
            name: string;
        };
        startLocation: string;
        endLocation: string;
        date: Date;
    } | null;

    bookingDate: Date;
    status: string;
    notes?: string;
}