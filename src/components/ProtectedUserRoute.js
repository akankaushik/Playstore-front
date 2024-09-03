import axios from "axios";
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import { fetchUserDetails } from "../../redux/slice/User/UserAuth";

const ProtectedUserRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");
            try {
                if (token) {
                    const response = await axios.get("http://localhost:9000/auth/user/userProfile", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response.data)
                    if (response.status === 200) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if(loading){
        return <p>Loading...</p>
    }
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedUserRoute;
