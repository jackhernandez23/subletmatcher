import React, { useState } from "react";

const Upload = () => {
    const [formData, setFormData] = useState({
        price: '',
        street: '',
        zipcode: '',
        unit: '',
        numRoommates: '',
        startDate: '',
        endDate: ''
    })

    const handleInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("attempting form submit...")

        //check that all inputs are valid

        if(formData.startDate >= formData.endDate) {
            alert("Lease cannot end before it starts")
            return
        }
        
        if(formData.price <= 0) {
            alert("Please enter a valid rent price");
            return
        }

        if(formData.numRoommates < 0) {
            alert("Please enter a valid number of roommates");
            return
        }

        console.log("input data validated, submitting form")
    }

    return (
        <div className="flex flex-col justify-center p-20 h-full space-y-20">
            <div>
                <h1 className="flex justify-center text-lg">
                    Upload a new listing
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-10 bg-gray-300 rounded-md w-25 h-50 items-center p-4">
                <div>
                    <label htmlFor="street">Street </label>
                    <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInput}
                    />
                </div>
                
                <div>
                    <label htmlFor="zipcode">Zip Code </label>
                    <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInput}
                    />
                </div>

                <div>
                    <label htmlFor="unit">Unit </label>
                    <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInput}
                    />
                </div>

                <div>
                    <label htmlFor="price">Rent Price $ </label>
                    <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInput}
                    />
                </div>

                <div>
                    <label htmlFor="numRoommates">Number of Roommates </label>
                    <input
                    type="number"
                    id="numRoommates"
                    name="numRoommates"
                    value={formData.numRoommates}
                    onChange={handleInput}
                    />
                </div>

                <div>
                    <label htmlFor="startDate">Lease Start Date </label>
                    <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInput}
                    />
                </div>

                <div>
                    <label htmlFor="endDate">Lease End Date </label>
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