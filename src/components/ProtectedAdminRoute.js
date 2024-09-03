import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/admin/auth/currentUser', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Handle response data
                setIsAuthenticated(true);
                setRole(response.data.roles); // Assuming the role is returned in response data
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        } else {
            // No token found, set unauthenticated state
            setLoading(false);
            setIsAuthenticated(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    console.log(isAuthenticated)
    console.log(role)

    if (!isAuthenticated || role !== 'ROLE_ADMIN') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
