import { React, useState, useEffect } from "react";
import $ from "jQuery";

const Listings = () => {

    const [listings, setListings] = useState([])

    // get listing data from backend
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await $.get('http://127.0.0.1:5000/listings');
                console.log('Data received:', JSON.stringify(response));
                setListings(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchListings();
    }, []);

    // proper date formatting
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col justify-center p-10">
            <div className="flex justify-center items-center py-11">
                <h1 className="text-xl font-bold">Listings</h1>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {listings
                .filter(listing => listing.available)
                .map((listing, index) => (
                    <div key={index} className="border p-4 rounded shadow">
                        <h2 className="text-l font-bold">{listing.street} Unit {listing.unit}</h2>
                        <p>Zipcode: {listing.zipcode}</p>
                        <p>Owner: {listing.owner}</p>
                        <p>Price: ${listing.price}</p>
                        <p>Number of Roommates: {listing.numOfRoommates}</p>
                        <p>Start Date: {formatDate(listing.startDate)}</p>
                        <p>End Date: {formatDate(listing.endDate)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Listings;