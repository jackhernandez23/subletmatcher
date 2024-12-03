import { React, useState, useEffect } from "react";
import $ from "jQuery";
import Cookie from "js-cookie"

const Bookmarks = () => {

    const loggedIn = Cookie.get('email')

    const [bookmarklist, setBookmarklist] = useState([])

    const [bookmark, setBookmark] = useState([])

    const [currentListing, setCurrentListing] = useState(null);

    const [currentPropPhotos, setCurrentPropPhotos] = useState([]);

    // get bookmark data from backend
    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await $.ajax({
                    url: `http://127.0.0.1:5000/list-bookmarks?email=${encodeURIComponent(loggedIn)}`,
                    method: 'GET',
                    dataType: 'json',
                    success: (response) => {
                        console.log('Data received:', JSON.stringify(response));
                        setBookmarklist(response);
                    },
                    error: (error) => {
                        console.error('Error fetching data:', error);
                    },
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchBookmarks()
    }, [])
    
    useEffect(() => {
        const loadBookmarks = async () => {
            const newBookmarks = []
            for(const element of bookmarklist) {
                try {
                    const response = await $.ajax({
                        url: `http://127.0.0.1:5000/get-listing?street=${encodeURIComponent(element.Street)}&unit=${encodeURIComponent(element.Unit)}&zipcode=${encodeURIComponent(element.Zipcode)}`,
                        method: 'GET',
                        dataType: 'json',
                        success: (response) => {
                            console.log('Data received:', JSON.stringify(response));
                            if(response.length > 0)
                                newBookmarks.push(response[0])
                        },
                        error: (error) => {
                            console.error('Error fetching data:', error);
                        },
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }

            setBookmark(newBookmarks);
            console.log("bookmark", bookmark )
        };
    
        if (bookmarklist.length > 0 && bookmark.length == 0) {
            loadBookmarks();
        } 
    }, [bookmarklist]);

    const deleteBookmark = (property) => { 
        try {
            const response = $.ajax({
                url: `http://127.0.0.1:5000/delete-bookmark?email=${encodeURIComponent(loggedIn)}&street=${encodeURIComponent(property.street)}&unit=${encodeURIComponent(property.unit)}&zipcode=${encodeURIComponent(property.zipcode)}`,
                method: 'POST',
                dataType: 'json',
                success: (response) => {
                    console.log('Data received:', JSON.stringify(response));
                    alert("bookmark deleted successfully")
                    window.location.reload();
                },
                error: (error) => {
                    console.error('Error fetching data:', error);
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }   

    const openBookmark = (property) => {
        setCurrentListing(property)
        getPhotos(property)
    }
    
    const downloadLease = (property) => {
        const url = `http://127.0.0.1:5000/download-lease/${encodeURIComponent(property.street)}/${encodeURIComponent(property.unit)}/${encodeURIComponent(property.zipcode)}`
        const link = document.createElement("a");
        console.log(url)
        link.href = url;
        link.setAttribute("download", "lease.pdf"); // Set a default file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const getPhotos = async (property) => {
        let numPropPhotos = 0
        let newPropPhotos = []
        try {
            await $.ajax({ 
                url: `http://127.0.0.1:5000/get-num-prop-photos?street=${encodeURIComponent(property.street)}&unit=${encodeURIComponent(property.unit)}&zipcode=${encodeURIComponent(property.zipcode)}`,
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

        const baseURL = `http://127.0.0.1:5000/prop-photo/${encodeURIComponent(property.street)}/${encodeURIComponent(property.unit)}/${encodeURIComponent(property.zipcode)}/`

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

    return (
        <div>
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
                            <div className="flex items-center justify-center m-10">
                                <button className="bg-blue-500 text-white p-2 rounded" onClick={() => deleteBookmark(currentListing)}>Delete Bookmark</button>
                            </div>
                        </div> 
                </div>
            </div>
            }

            <div className={currentListing === null ? "flex flex-col justify-center py-5 px-10" : "opacity-50 flex flex-col justify-center py-5 px-10"}>
                <div className="pb-10 pt-5">
                    <h1 className="flex justify-center font-bold text-4xl">
                        Bookmarks
                    </h1>
                </div>
                <div className="grid grid-cols gap-4">
                    <div className="grid grid-cols-3 gap-4 h-1/2">
                        {bookmark
                        .filter(bookmark => bookmark.available
                        )
                        .map((bookmark, index) => (
                            <div key={index} onClick={() => openBookmark(bookmark)} className="border p-4 rounded shadow">
                                <h2 className="text-l font-bold">{bookmark.street} Unit {bookmark.unit}</h2>
                                <p>Zipcode: {bookmark.zipcode}</p>
                                <p>Owner: {bookmark.owner}</p>
                                <p>Contact: {bookmark.contact}</p>
                                <p>Price: ${bookmark.price}</p>
                                <p>Number of Roommates: {bookmark.numOfRoommates}</p>
                                <p>Start Date: {formatDate(bookmark.startDate)}</p>
                                <p>End Date: {formatDate(bookmark.endDate)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookmarks;