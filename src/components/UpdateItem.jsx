import React, { useState, useEffect } from 'react';

const API_URI = 'http://localhost:8000/doors';

const UpdateItem = ({ itemId }) => {
    const [item, setItem] = useState(null);
    const [updatedItem, setUpdatedItem] = useState({});
    const [message, setMessage] = useState('');

    // Fetch the existing item when the component mounts
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`${API_URI}/${itemId}`);
                if (response.ok) {
                    const data = await response.json();
                    setItem(data);
                    setUpdatedItem(data); // Initialize updatedItem with the fetched data
                } else {
                    setMessage('Failed to fetch the item. Item not found.');
                }
            } catch (error) {
                setMessage('An error occurred while fetching the item.');
            }
        };

        fetchItem();
    }, [itemId]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission to update the item
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URI}/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Item updated successfully!');
                setItem(data); // Update the item state with the updated data
            } else {
                setMessage('Failed to update the item.');
            }
        } catch (error) {
            setMessage('An error occurred while updating the item.');
        }
    };

    return (
        <div>
            <h2>Update Item</h2>
            {message && <p>{message}</p>}
            {item ? (
                <form onSubmit={handleUpdate}>
                    {Object.keys(item).map((key) => (
                        key !== 'id' && ( // Prevent editing the 'id' field
                            <div key={key}>
                                <label>
                                    {key}:
                                    <input
                                        type="text"
                                        name={key}
                                        value={updatedItem[key] || ''}
                                        placeholder={item[key]}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        )
                    ))}
                    <button type="submit">Update</button>
                </form>
            ) : (
                <p>Loading item...</p>
            )}
        </div>
    );
};

export default UpdateItem;