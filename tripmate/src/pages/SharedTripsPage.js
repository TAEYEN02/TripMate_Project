import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/SharedTripsPage.css'

function SharedTripsPage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSharedSchedules = async () => {
            try {
                const response = await axios.get('http://localhost:8080/schedule/shared');
                setSchedules(response.data);
            } catch (err) {
                setError('Failed to fetch shared schedules.');
                console.error('Error fetching shared schedules:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedSchedules();
    }, []);

    if (loading) {
        return <div className="shared-trips-container">Loading shared trips...</div>;
    }

    if (error) {
        return <div className="shared-trips-container error-message">{error}</div>;
    }

    return (
        <div className="shared-trips-container">
            <h1>Shared Travel Schedules</h1>
            {schedules.length === 0 ? (
                <p>No shared schedules available yet.</p>
            ) : (
                <div className="schedule-grid">
                    {schedules.map((schedule) => (
                        <div key={schedule.id} className="schedule-card">
                            <h2>{schedule.title || 'Untitled Schedule'}</h2>
                            <p><strong>Date:</strong> {schedule.date}</p>
                            <p>{schedule.description || 'No description provided.'}</p>
                            {/* You might want to parse and display places more nicely */}
                            <p><strong>Places:</strong> {schedule.places}</p>
                            <p><strong>Shared by:</strong> {schedule.user ? schedule.user.username : 'Unknown User'}</p>
                            {/* Add a link to a detailed view if you create one */}
                            {/* <Link to={`/shared-trip/${schedule.id}`}>View Details</Link> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SharedTripsPage;
