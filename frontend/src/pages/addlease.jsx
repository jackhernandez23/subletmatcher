import React, { useState } from "react";
import Cookies from 'js-cookie';

const Upload = () => {
    const [formData, setFormData] = useState({
        price: '',
        street: '',
        zipcode: '',
        unit: '',
        numOfRoommates: '',
        startDate: '',
        endDate: '',
        available: '1',
        owner: Cookies.get('email')
    })

    const handleInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("attempting form submit...")

        // check that all inputs are valid

        // validate dates
        if((formData.startDate >= formData.endDate) || (new Date(formData.endDate) < new Date())) {
            alert("Please enter valid dates")
            return
        }
        
        // validate price
        if(formData.price <= 0) {
            alert("Please enter a valid rent price");
            return
        }

        // validate num roommates
        if(formData.numOfRoommates < 0) {
            alert("Please enter a valid number of roommates");
            return
        }

        console.log("input data validated, submitting form")

        // make HTTP request to send data to backend
        try {
            const response = await fetch('http://127.0.0.1:5000/addlease', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
      
            // handle the response
            if (response.ok) {
              const result = await response.json();
              console.log('Success:', result);
              window.location.href = '/profile';
            } else {
              console.error('Error:', response.statusText);
              alert("An error occured while uploading listing")
            }
          } catch (error) {
            console.error('Network error:', error);
            alert("An error occured while uploading listing")
          }
    };

    return (
        <div className="flex flex-col justify-center items-center p-20 h-full space-y-20">
            <div>
                <h1 className="flex justify-center text-lg">
                    Upload a new listing
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-10 bg-gray-300 rounded-md w-1/2 h-50 items-center p-4">
                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="street">Street </label>
                    <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="unit">Unit </label>
                    <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="zipcode">Zip Code </label>
                    <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInput}
                    />
                </div>

                <div  className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="price">Rent Price $ </label>
                    <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="numOfRoommates">Number of Roommates </label>
                    <input
                    type="number"
                    id="numOfRoommates"
                    name="numOfRoommates"
                    value={formData.numOfRoommates}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="startDate">Lease Start Date </label>
                    <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInput}
                    />
                </div>

                <div className="justify-center w-3/4 flex flex-row">
                    <label className="items-start w-3/4" htmlFor="endDate">Lease End Date </label>
                    <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInput}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Upload;