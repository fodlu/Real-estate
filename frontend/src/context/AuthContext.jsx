import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../config";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(
		localStorage.getItem("token") || sessionStorage.getItem("token") || null,
	);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// login
	const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_URL}/api/auth/login`, {
				email,
				password,
			});

			const { token, user } = response.data;
			setToken(token);
			setUser(user);

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			return { success: true };
		} catch (err) {
			return {
				success: false,
				message: err.response?.data?.message || "Login Denied or Failed",
			};
		}
	};

	const register = async (userData) => {
		try {
			const response = await axios.post(
				`${API_URL}/api/auth/register`,
				userData,
			);
			return {
				success: true,
				message: response.data.message,
			};
		} catch (err) {
			return {
				success: false,
				message: err.response?.data?.message || "Registration Failed",
			};
		}
	};

	// logout
	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		navigate("/login");
	};

	// to get user details
	const refreshUser = async () => {
		if (!token) return;
		try {
			const response = await axios.get(`${API_URL}/api/auth/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.data.success) {
				const updatedUser = response.data.user;
				setUser(updatedUser);
				const storage =
					localStorage.getItem("token") ? localStorage : sessionStorage;

				storage.setItem("user", JSON.stringify(updatedUser));
			}
		} catch (err) {
			console.error("Failed to reset the user: ", err);
		}
	};

    useEffect(() => {
		if (token) {
			const storedUser =
				localStorage.getItem("user") || sessionStorage.getItem("user");
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
		}

		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (
					error.response &&
					error.response.status(403) &&
					error.response.data.message.includes("blocked")
				) {
					logout();
				}

				return Promise.reject(error);
			},
		);

		return () => axios.interceptors.response.eject(interceptor);
	}, [token]);

	const value = {
		user,
		setUser,
		token,
		loading,
		login,
		register,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
