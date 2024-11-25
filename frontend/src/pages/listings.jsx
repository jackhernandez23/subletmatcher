import { React, useState, useEffect } from "react";
import $ from "jQuery";
import Slider from '@mui/material/Slider';

const Listings = () => {

    const [listings, setListings] = useState([])
    const [filters, setFilters] = useState({
        price: 10000,
        roommates: 15,
        zipcode: "",
        startDate: "",
        endDate: "",
    })

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
    
    const handlePriceChange = (event) => {
        setFilters({
            ...filters,
            price: event.target.value,
        });
    };

    const handleRoommateChange = (event) => {
        setFilters({
            ...filters,
            roommates: event.target.value,
        });
    };

    const handleZipChange = (event) => {
        setFilters({
            ...filters,
            zipcode: event.target.value,
        });
    };

    const handleStartChange = (event) => {
        setFilters({
            ...filters,
            startDate: new Date(event.target.value),
        });
    };

    const handleEndChange = (event) => {
        setFilters({
            ...filters,
            endDate: new Date(event.target.value),
        });
    };

    return (
        <div className="flex flex-col justify-center p-10">
            <div className="flex justify-center items-center py-11">
                <h1 className="text-xl font-bold">Available Listings</h1>
            </div>
            <div className="grid grid-cols-[80%_20%] gap-4">
                <div className="grid grid-cols-3 gap-4">
                    {listings //apply filters for shown listings
                    .filter(listing => listing.available
                        && listing.price <= filters.price
                        && listing.numOfRoommates <= filters.roommates
                        && (filters.zipcode == "" ? true : (listing.zipcode == filters.zipcode))
                        && (filters.startDate == "" ? true : (new Date(listing.startDate) >= filters.startDate))
                        && (filters.endDate == "" ? true : (new Date(listing.endDate) <= filters.endDate))
                    )
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
                <div className="border p-4 rounded shadow h-96">
                    <div className="flex flex-col justify-center items-center pb-5">
                        <h1 className="text-lg font-bold">Filters</h1>
                    </div>
                    <div className="flex flex-col px-3 pb-3 items-center">
                        <h1 className="font-bold">Price</h1>
                        <Slider
                            valueLabelDisplay="auto"
                            defaultValue={10000}
                            min={0}
                            max={10000}
                            step={100}
                            onChange={handlePriceChange}
                        />
                        
                    </div>
                    <div className="flex flex-col px-3 pb-3 items-center">
                        <h1 className="font-bold">Roommates</h1>
                        <Slider
                            valueLabelDisplay="auto"
                            defaultValue={15}
                            min={0}
                            max={15}
                            onChange={handleRoommateChange}
                        />   
                    </div>
                    <div className="flex flex-col gap-3 px-3 pb-5 items-center">
                        <h1 className="font-bold">Zip Code</h1>
                        <input className="w-20 rounded shadow"
                            type="number" 
                            onChange={handleZipChange} 
                            placeholder="00000" 
                        />
                    </div>
                    <div className="flex flex-col gap-3 pb-5 items-center">
                        <h1 className="font-bold">Date Range</h1>
                        <div className="flex flex-col gap-2 items-center">
                            <label>From
                                <input className="rounded shadow mx-3 mb-1"
                                    type="date" 
                                    onChange={handleStartChange}
                                />
                            </label>
                            <label>To
                                <input className="rounded shadow mx-3"
                                    type="date" 
                                    onChange={handleEndChange}  
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Listings;