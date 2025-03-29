import React, { useState, useEffect } from 'react';

const API_URI = 'http://localhost:8000/doors';

const UpdateItem = () => {
    const [itemId, setItemId] = useState('');
    const [item, setItem] = useState(null);
    const [updatedItem, setUpdatedItem] = useState({});
    const [message, setMessage] = useState('');

    const fetchItem = async () => {
        if (!itemId.trim()) {
            setMessage('Please enter a valid item ID.');
            return;
        }

        try {
            const response = await fetch(`${API_URI}/${itemId}`);
            if (response.ok) {
                const data = await response.json();
                setItem(data);
                setUpdatedItem(data);
                setMessage('');
            } else {
                setMessage('Failed to fetch the item. Item not found.');
                setItem(null);
            }
        } catch (error) {
            setMessage('An error occurred while fetching the item.');
            setItem(null);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
            <div>
                <label>
                    Enter Item ID:
                    <input
                        type="text"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        placeholder="Enter item ID"
                    />
                </label>
                <button onClick={fetchItem}>Fetch Item</button>
            </div>
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