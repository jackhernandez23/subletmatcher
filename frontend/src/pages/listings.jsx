import { React, useState, useEffect } from "react";
import $ from "jQuery";
import Slider from '@mui/material/Slider';
import Cookie from 'js-cookie';

const Listings = () => {

    const loggedIn = Cookie.get('email')
    const [listings, setListings] = useState([])
    const [filters, setFilters] = useState({
        price: 10000,
        roommates: 15,
        zipcode: "",
        startDate: "",
        endDate: "",
    })
    const [currentListing, setCurrentListing] = useState(null);
    const [currentPropPhotos, setCurrentPropPhotos] = useState([]);

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

    const openListing = (listing) => {
        setCurrentListing(listing)
        getPhotos(listing)
    }
    
    const bookmark = (listing) => {
        const bookmarkData = { 'email': loggedIn, 'street': listing.street, 'unit': listing.unit, 'zipcode': listing.zipcode }
        try {
            const response = $.ajax({
                url: 'http://127.0.0.1:5000/bookmark',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(bookmarkData),
                dataType: 'json',
                success: (response) => {
                    console.log('Data received:', JSON.stringify(response));
                    alert("Listing bookmarked successfully")
                },
                error: (error) => {
                    console.error('Error fetching data:', error);
                },
            }); 
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("There was an error bookmarking this listing")
        }
    }

    const downloadLease = (listing) => {
        const url = `http://127.0.0.1:5000/download-lease/${encodeURIComponent(listing.street)}/${encodeURIComponent(listing.unit)}/${encodeURIComponent(listing.zipcode)}`
        const link = document.createElement("a");
        console.log(url)
        link.href = url;
        link.setAttribute("download", "lease.pdf"); // Set a default file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const getPhotos = async (listing) => {
        let numPropPhotos = 0
        let newPropPhotos = []
        try {
            await $.ajax({ 
                url: `http://127.0.0.1:5000/get-num-prop-photos?street=${encodeURIComponent(listing.street)}&unit=${encodeURIComponent(listing.unit)}&zipcode=${encodeURIComponent(listing.zipcode)}`,
                method: 'GET',
                success: (response) => {
                    console.log('Data received:', JSON.stringify(response));
                    numPropPhotos = response.numPics
                    console.log(numPropPhotos)
                },
                error: (error) => {
                    console.error('Error fetching data:', error);
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        console.log("continuing")

        const baseURL = `http://127.0.0.1:5000/prop-photo/${encodeURIComponent(listing.street)}/${encodeURIComponent(listing.unit)}/${encodeURIComponent(listing.zipcode)}/`

        for (let i = 0; i < numPropPhotos; i++)
            newPropPhotos.push(baseURL + encodeURIComponent(i))

        setCurrentPropPhotos(newPropPhotos)
        console.log(currentPropPhotos )
    }

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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            {currentListing != null &&
                <div className="fixed inset-0 opacity-100 flex w-full h-full items-center justify-center z-50" onClick={() => setCurrentListing(null)}>
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl fixed grid grid-cols-2 justify-end" onClick={(e) => e.stopPropagation()}>
                        <div className="col-span-2 flex items-center justify-center">
                            <h2 className="col-span-2 text-2xl font-semibold mb-2">{currentListing.street} Unit {currentListing.unit}</h2>
                        </div>
                        <div className="col-span-1">
                            <p className="text-lg pb-1">Zipcode: {currentListing.zipcode}</p>
                            <p className="text-lg pb-1">Owner: {currentListing.owner}</p>
                            <p className="text-lg pb-1">Contact: {currentListing.contact}</p>
                            <p className="text-lg pb-1">Price: ${currentListing.price}</p>
                            <p className="text-lg pb-1">Number of Roommates: {currentListing.numOfRoommates}</p>
                            <p className="text-lg pb-1">Start Date: {formatDate(currentListing.startDate)}</p>
                            <p className="text-lg pb-1">End Date: {formatDate(currentListing.endDate)}</p>
                        </div>
                        <div>
                            {currentPropPhotos.map((picture) => (
                                <div className="w-1/2 m-2 col-start-2">
                                    <img src={picture}/>
                                </div>
                            ))}
                        </div>
                        <br></br>
                        <p className="text-lg pb-1 col-span-2">{currentListing.description}</p>
                        <div className="flex justify-center col-span-2">
                            <div className="flex items-center justify-center m-10">
                                <button className="bg-blue-500 text-white p-2 rounded" onClick={() => downloadLease(currentListing)}>Download Lease</button>
                            </div>
                            {loggedIn &&
                            <div className="flex items-center justify-center m-10">
                                <button className="bg-blue-500 text-white p-2 rounded" onClick={() => bookmark(currentListing)}>Bookmark</button>
                            </div>}
                        </div>   
                    </div>
                </div>
            }

            <div className={currentListing === null ? "flex flex-col justify-center py-5 px-10" : "opacity-50 flex flex-col justify-center py-5 px-10"}>
                <div className="flex items-center justify-center mb-10">
                    <h1 className="font-bold text-4xl">
                        Available Listings
                    </h1>
                </div>
                <div className="grid grid-cols-[80%_20%] gap-4">
                    <div className="min-w-[900px] max-w-[900px] grid grid-cols-3 gap-4 h-1/2">
                        {listings //apply filters for shown listings
                        .filter(listing => listing.available
                            && listing.price <= filters.price
                            && listing.numOfRoommates <= filters.roommates
                            && (filters.zipcode == "" ? true : (listing.zipcode == filters.zipcode))
                            && (filters.startDate == "" ? true : (new Date(listing.startDate) >= filters.startDate))
                            && (filters.endDate == "" ? true : (new Date(listing.endDate) <= filters.endDate))
                        )
                        .map((listing, index) => (
                            <div key={index} onClick={() => openListing(listing)} className="border p-4 rounded shadow">
                                <h2 className="text-l font-bold">{listing.street} Unit {listing.unit}</h2>
                                <p>Zipcode: {listing.zipcode}</p>
                                <p>Owner: {listing.owner}</p>
                                <p>Contact: {listing.contact}</p>
                                <p>Price: ${listing.price}</p>
                                <p>Number of Roommates: {listing.numOfRoommates}</p>
                                <p>Start Date: {formatDate(listing.startDate)}</p>
                                <p>End Date: {formatDate(listing.endDate)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="min-w-[300px] max-w-[300px] border p-4 rounded shadow bg-gradient-to-b from-teal-200 to-blue-200 h-96 w-full">
                        <div className="flex flex-col justify-center items-center pb-3">
                            <h1 className="text-xl font-bold">
                                Filters
                            </h1>
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
        </div>
    );
};

export default Listings;