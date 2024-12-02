import { React, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import $ from "jQuery";

const Upload = () => {
    const [input, setInput] = useState({
        price: '',
        street: '',
        zipcode: '',
        unit: '',
        numOfRoommates: '',
        startDate: '',
        endDate: '',
        available: '1',
        owner: '',
        contact: Cookies.get('email'),
        description: '',
        lease: null
    })

    useEffect(() => { //get user's name to upload to listing
        const fetchName = async () => {
            try {
                const sendData = { 'email': Cookies.get('email') }
                const response = await $.ajax({
                    url: 'http://127.0.0.1:5000/get-name',
                    method: 'GET',
                    data: sendData,
                })
                console.log('Data received:', JSON.stringify(response));
                setInput({
                    ...input,
                    owner: response[0].name,
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchName()
    }, [])

    const handleInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        })
    }

    const handleLeaseUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          // Check if the file is a PDF
          if (selectedFile.type !== "application/pdf") {
            alert("Please upload a PDF.");
            setInput({
                ...input,
                lease: null,
            })
          } else {
            setInput({
                ...input,
                lease: selectedFile,
            })
          }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("validating input...")

        // check that all inputs are valid

        // validate dates
        if((input.startDate >= input.endDate) || (new Date(input.endDate) < new Date())) {
            alert("Please enter valid dates")
            return
        }
        
        // validate price
        if(input.price <= 0) {
            alert("Please enter a valid rent price");
            return
        }

        // validate num roommates
        if(input.numOfRoommates < 0 || input.numOfRoommates > 15) {
            alert("Please enter a valid number of roommates (0 to 15)");
            return
        }

        // validate if lease has been added
        if(input.lease == null) {
            alert("Please upload a lease in PDF format");
            return
        }

        console.log("input data validated, attempting form submission...")

        // make HTTP requests to send data to backend
        try {

            const formData = new FormData();
            formData.append('street', input.street);
            formData.append('unit', input.unit);
            formData.append('zipcode', input.zipcode);
            formData.append('owner', input.owner);
            formData.append('contact', input.contact);
            formData.append('price', input.price);
            formData.append('available', input.available);
            formData.append('numOfRoommates', input.numOfRoommates);
            formData.append('startDate', input.startDate);
            formData.append('endDate', input.endDate);
            formData.append('description', input.description);
            formData.append('lease', input.lease);

            const response = await fetch('http://127.0.0.1:5000/addlease', {
              method: 'POST',
              body: formData
            });
      
            // handle the response
            if (response.ok) {
              const result = await response.json();
              console.log('Success:', result);
              window.location.href = '/mylistings';
            } else {
              console.error('Error:', response.statusText);
              alert("An error occured while uploading listing")
            }
        } catch (error) {
            console.error('Network error:', error);
            alert("An error occured while uploading listing")
            return
        }
    };

    return (
        <div className="flex flex-col justify-center items-center p-10 h-full space-y-10">
            <div>
                <h1 className="flex justify-center font-bold text-4xl">
                    Upload a new listing
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col bg-gray-300 rounded-md w-3/5 h-50 items-center py-10 space-y-10">
                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="lease file">Upload lease</label>
                    <input className="justify-end items-end w-3/5"
                    type="file"
                    onChange={handleLeaseUpload}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="street">Street </label>
                    <input
                    type="text"
                    id="street"
                    name="street"
                    value={input.street}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="unit">Unit </label>
                    <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={input.unit}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="zipcode">Zip Code </label>
                    <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={input.zipcode}
                    onChange={handleInput}
                    />
                </div>

                <div  className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="price">Rent Price $ </label>
                    <input
                    type="number"
                    id="price"
                    name="price"
                    value={input.price}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="numOfRoommates">Number of Roommates </label>
                    <input
                    type="number"
                    id="numOfRoommates"
                    name="numOfRoommates"
                    value={input.numOfRoommates}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="startDate">Lease Start Date </label>
                    <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={input.startDate}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="endDate">Lease End Date </label>
                    <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={input.endDate}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="description">Description </label>
                    <textarea className="w-full"
                    id="description"
                    name="description"
                    value={input.description}
                    onChange={handleInput}
                    />
                </div>

                <button type="submit"
                className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-400 transition"
                >
                    Submit</button>
            </form>
        </div>
    );
};

export default Upload;