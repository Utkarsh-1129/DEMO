import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api";
import toast from "react-hot-toast";

// Export the AuthContext so it can be imported elsewhere
export const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const token = localStorage.getItem("authToken");
			if (token) {
				const userData = await apiService.getUserProfile();
				setUser(userData);
				setIsAuthenticated(true);
			}
		} catch (error) {
			localStorage.removeItem("authToken");
		} finally {
			setIsLoading(false);
		}
	};

	// credentials must include userType: 'farmer' | 'officer'
	const login = async (credentials) => {
		try {
			let response;
			if (credentials.userType === "officer") {
				response = await apiService.agriLogin({
					licenseNumber: credentials.licenseNumber,
					password: credentials.password,
				});
			} else {
				response = await apiService.userLogin({
					phone: credentials.phone,
					password: credentials.password,
				});
			}
			localStorage.setItem("authToken", response.token);
			setUser(response.user);
			setIsAuthenticated(true);
			toast.success("Login successful!");
			return response;
		} catch (error) {
			toast.error(error.response?.data?.message || "Login failed");
			throw error;
		}
	};

	// userData must include userType: 'farmer' | 'officer'
	const register = async (userData) => {
		try {
			let response;
			if (userData.userType === "officer") {
				response = await apiService.agriRegister({
					name: userData.name,
					phone: userData.phone,
					location: userData.location,
					password: userData.password,
					confirm_password: userData.confirm_password,
					email: userData.email,
					licenseNumber: userData.licenseNumber,
					aadhar: userData.aadhar,
				});
			} else {
				response = await apiService.userRegister({
					name: userData.name,
					phone: userData.phone,
					location: userData.location,
					password: userData.password,
					confirm_password: userData.confirm_password,
				});
			}
			localStorage.setItem("authToken", response.token);
			setUser(response.user);
			setIsAuthenticated(true);
			toast.success("Account created successfully!");
			return response;
		} catch (error) {
			toast.error(error.response?.data?.message || "Registration failed");
			throw error;
		}
	};

	// userType must be passed to determine which logout endpoint to use
	const logout = async (userType = "farmer") => {
		try {
			if (userType === "officer") {
				await apiService.agriLogout();
			} else {
				await apiService.userLogout();
			}
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("authToken");
			setUser(null);
			setIsAuthenticated(false);
			toast.success("Logged out successfully");
		}
	};

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
