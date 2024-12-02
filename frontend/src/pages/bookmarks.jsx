import { React, useState, useEffect } from "react";
import $ from "jQuery";
import Cookie from "js-cookie"

const Bookmarks = () => {

    const loggedIn = Cookie.get('email')

    const [bookmarklist, setBookmarklist] = useState([])
    const [bookmark, setBookmark] = useState([])

    const [currentListing, setCurrentListing] = useState(null);

    // get bookmark data from backend
    useEffect(() => {
        const fetchBookmarks = () => {
            try {
                const response = $.ajax({
                    url: `http://127.0.0.1:5000/list-bookmarks?email=${encodeURIComponent(loggedIn)}`,
                    method: 'GET',
                    dataType: 'json',
                });
                console.log('Data received:', JSON.stringify(response));
                setBookmarklist(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    
        fetchBookmarks()
    }, [])
    
    useEffect(() => {
        const loadBookmarks = async () => {
            console.log("loading bookmarks ", bookmarklist)
            const bookmarks = []
            
            for (const element of bookmarklist) {
                console.log("loading element ", element)
                try {
                    const response = await $.ajax({
                        url: `http://127.0.0.1:5000/get-listing?street=${encodeURIComponent(element.street)}&unit=${encodeURIComponent(element.unit)}&zipcode=${encodeURIComponent(element.zipcode)}`,
                        method: 'GET',
                        dataType: 'json',
                    });
                    console.log('Data received:', JSON.stringify(response));
                    bookmarks.push(response)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }

            setBookmark(bookmarks)
            
        }

        console.log("bookmarklist: ", bookmarklist)
        if (bookmarklist.length > 0) {
            loadBookmarks();
        }

    },  [bookmarklist])

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
                    <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 h-4/5 max-w-lg fixed" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-semibold mb-2">{currentListing.street} Unit {currentListing.unit}</h2>
                        <p className="text-lg pb-1">Zipcode: {currentListing.zipcode}</p>
                        <p className="text-lg pb-1">Owner: {currentListing.owner}</p>
                        <p className="text-lg pb-1">Contact: {currentListing.contact}</p>
                        <p className="text-lg pb-1">Price: ${currentListing.price}</p>
                        <p className="text-lg pb-1">Number of Roommates: {currentListing.numOfRoommates}</p>
                        <p className="text-lg pb-1">Start Date: {formatDate(currentListing.startDate)}</p>
                        <p className="text-lg pb-1">End Date: {formatDate(currentListing.endDate)}</p>
                        <br></br>
                        <p className="text-lg pb-1">{currentListing.description}</p>
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
                            <div key={index} onClick={() => setCurrentListing(bookmark)} className="border p-4 rounded shadow">
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