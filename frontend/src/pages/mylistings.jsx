import { React, useState, useEffect } from "react";
import $ from "jQuery";
import Cookies from 'js-cookie';

const MyListings = () => {

    const [listings, setListings] = useState([])
    const loggedIn = Cookies.get('email');

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
        const date = new Date(Date.UTC(
            new Date(dateString).getFullYear(),
            new Date(dateString).getMonth(),
            new Date(dateString).getDate() + 2
        ));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };
    

    return (
        <div className="flex flex-col justify-center py-5 px-10">
            <div className="pb-10 pt-5">
                <h1 className="flex justify-center font-bold text-4xl">
                    My Listings
                </h1>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {listings
                .filter(listing => (listing.owner == loggedIn))
                .map((listing, index) => (
                    <div key={index} className="border p-4 rounded shadow">
                        <h2 className="text-l font-bold">{listing.street} Unit {listing.unit}</h2>
                        <p>Zipcode: {listing.zipcode}</p>
                        <p>Contact: {listing.owner}</p>
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

export default MyListings;