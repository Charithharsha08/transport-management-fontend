



  /*  if (loading) {
        return <div className="text-center p-8 text-lg">Loading dashboard...</div>;
    }

    if (!data) {
        return <div className="text-center p-8 text-red-600">Failed to load data</div>;
    }*/

  export function Dashboard() {
      return (
          <div className="p-8 min-h-screen bg-gray-100">
              <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin Dashboard</h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                      <Card label="Total Trips" value='100' />
                      <Card label="Completed Trips" value='50' />
                      <Card label="Bookings" value="2" />
                      <Card label="Users" value="10" />
                      <Card label="Drivers" value="5" />
                      <Card label="Customers" value="3" />
                      <Card label="Vehicles" value="3" />
                      <Card label="Revenue" value={`Rs. `} />
                  </div>
              </div>
          </div>
      );
  }


  function Card({label, value}: {label: string; value: number | string}) {
            return (
            <div className="bg-white shadow-md rounded-lg p-5 text-center">
            <h3 className="text-lg font-semibold text-gray-600">{label}</h3>
      <p className="text-2xl font-bold text-blue-700 mt-2">{value}</p>
        </div>
    );
}

