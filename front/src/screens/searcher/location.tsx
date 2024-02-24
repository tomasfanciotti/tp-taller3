import React, { useState } from 'react';

function LocationComponent() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [veterinaries, setVeterinaries] = useState([]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setLocation({ latitude, longitude });
                    sendLocation(latitude, longitude);
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("La geolocalización no está disponible en este navegador.");
        }
    };

    const sendLocation = (latitude, longitude) => {
        const url = `http://localhost:9000/veterinaries/nearest?latitude=${latitude}&longitude=${longitude}&radius=1000`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al enviar la ubicación');
                }
                var jsonresp = response.json();
                console.log(jsonresp)
                return jsonresp; // Convertir la respuesta a JSON
            })
            .then(data => {
                setVeterinaries(data?.results); // Almacenar la lista de veterinarias en el estado
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <button onClick={getLocation}>Obtener ubicación</button>
            {error && <p>Error: {error}</p>}
            {location && (
                <div>
                    <p>
                        Esta es tu ubicación: <br />
                        Latitud: {location.latitude} <br />
                        Longitud: {location.longitude}
                    </p>
                    <h2>Veterinarias cercanas:</h2>
                    <ul>
                        {veterinaries.map((veterinary, index) => (
                            <li key={index}>
                                <strong>{veterinary.name}</strong> - {veterinary.address}, {veterinary.city} <br />
                                Teléfono: {veterinary.phone}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default LocationComponent;