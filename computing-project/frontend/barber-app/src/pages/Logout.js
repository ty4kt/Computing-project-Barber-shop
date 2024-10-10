import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate(); 

    useEffect(() => {
        localStorage.removeItem("authToken");
        navigate("/"); 
    }, [navigate]); 

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    );
};

export default Logout;
