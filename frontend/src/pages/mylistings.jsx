import { React, useState, useEffect } from "react";
import $ from "jQuery";
import Slider from '@mui/material/Slider';
import Cookies from "js-cookie"

const MyListings = () => {

    const [listings, setListings] = useState([])

    const loggedIn = Cookies.get('email');

    const [currentListing, setCurrentListing] = useState(null);

    const [input, setInput] = useState({
        price: null,
        numOfRoommates: null,
        available: null,
        description: null,
    })

    const openListing = (listing) => {
        setCurrentListing(listing)
        setInput({
            price: listing.price,
            numOfRoommates: listing.numOfRoommates,
            available: listing.available,
            description: listing.description,
        })
    }

    const closeListing = () => {
        setCurrentListing(null)
        setInput({
            price: null,
            numOfRoommates: null,
            available: null,
            description: null,
        })
    }

    const handleInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        })
    }

    const handleAvailability = (e) => {
        e.preventDefault();
        setInput((prevInput) => ({
            ...prevInput,
            available: !prevInput.available, 
        }));
    }

    const submitChanges = async () => {
        try {
            const formData = {
                'street': currentListing.street,
                'unit': currentListing.unit,
                'zipcode': currentListing.zipcode,
                'contact': currentListing.contact,
                'price': input.price,
                'available': input.available,
                'numOfRoommates': input.numOfRoommates,
                'description': input.description
            }

            const response = await $.ajax({
                url: 'http://127.0.0.1:5000/edit-user-lease',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                dataType: 'json',
            });
            console.log('Response: ', response);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    // get listing data from backend
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await $.ajax({
                    url: 'http://127.0.0.1:5000/listings',
                    method: 'GET',
                });
                console.log('Data received:', JSON.stringify(response));
                setListings(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchListings()
    }, [])
    

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
        <div>
            {currentListing != null &&
                <div className="fixed inset-0 opacity-100 flex w-full h-full items-center justify-center z-50" onClick={closeListing}>
                    <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-lg fixed flex flex-col justify-end" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold mb-2">Edit {currentListing.street} Unit {currentListing.unit}</h2>
                        <div className="grid grid-cols-2 space-y-8 flex-grow">
                            <p className="text-lg pt-8">Price</p>
                            <input
                                className="flow text-lg pb-1 shadow-sm bg-slate-200 text-center"
                                type="number"
                                id="price"
                                name="price"
                                value={input.price}
                                onChange={handleInput}
                            />
                            <p className="text-lg pb-1">Number of Roommates</p>
                            <input
                                className="text-lg pb-1 shadow-sm bg-slate-200 text-center"
                                type="number"
                                id="numOfRoommates"
                                name="numOfRoommates"
                                value={input.numOfRoommates}
                                onChange={handleInput}
                            />
                            <p className="text-lg pb-1">Currently available</p>
                            <input
                                type="checkbox"
                                id="available"
                                name="available"
                                checked={input.available}
                                onChange={handleAvailability}
                            />
                            </div>
                            <textarea
                                className="w-full text-lg mt-10 shadow-sm bg-slate-200"
                                id="description"
                                name="description"
                                value={input.description}
                                onChange={handleInput}
                            />
                            <div className="flex items-center justify-center mt-10">
                                <button className="bg-blue-500 text-white p-2 rounded" onClick={submitChanges}>Submit</button>
                            </div>
                    </div>
                </div>
            }

            <div className={currentListing === null ? "flex flex-col justify-center py-5 px-10" : "opacity-50 flex flex-col justify-center py-5 px-10"}>
                <div className="flex flex-col pb-10 pt-5">
                    <h1 className="flex justify-center font-bold text-4xl">
                        My Listings
                    </h1>
                    <h1 className="flex justify-center text-l pt-3">
                        click on a listing to edit
                    </h1>
                </div>
                <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4 h-1/2">
                        {listings
                        .filter(listing => listing.contact == loggedIn)
                        .map((listing, index) => (
                            <div key={index} onClick={() => openListing(listing)} className="border p-4 rounded shadow">
                                <h2 className="text-l font-bold">{listing.street} Unit {listing.unit}</h2>
                                <p>Zipcode: {listing.zipcode}</p>
                                <p>Price: ${listing.price}</p>
                                <p>Number of Roommates: {listing.numOfRoommates}</p>
                                <p>Start Date: {formatDate(listing.startDate)}</p>
                                <p>End Date: {formatDate(listing.endDate)}</p>
                            </div>
                        ))}
                    </div>              
                </div>
            </div>
        </div>
    );
};

export default MyListings;