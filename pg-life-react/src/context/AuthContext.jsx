import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" or "signup"

  // Load user profile on mount if token exists
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      setUser(response.data);
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login
  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { token: receivedToken, ...userData } = response.data;
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(userData);
      setIsAuthModalOpen(false);
      toast.success(`Welcome back, ${userData.name}! 👋`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Register
  const register = async (signupData) => {
    try {
      const response = await authApi.register(signupData);
      const { token: receivedToken, ...userData } = response.data;
      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(userData);
      setIsAuthModalOpen(false);
      toast.success(`Account created! Welcome, ${userData.name}! 🎉`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const response = await authApi.updateProfile(formData);
      setUser(response.data);
      toast.success("Profile updated successfully! ✨");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Update failed.";
      toast.error(message);
      return { success: false };
    }
  };

  // Toggle favorite property
  const toggleFavorite = async (propertyId) => {
    if (!user) {
      setAuthModalMode("login");
      setIsAuthModalOpen(true);
      toast.warning("Please login to save favorites ❤️");
      return false;
    }

    try {
      const response = await authApi.toggleFavorite(propertyId);
      setUser((prev) => ({
        ...prev,
        favorites: response.data.favorites,
      }));
      toast[response.data.liked ? "success" : "info"](response.data.message);
      return response.data.liked;
    } catch (error) {
      toast.error("Could not update favorites");
      return false;
    }
  };

  // Check if property is favorited
  const isFavorite = (propertyId) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some((fav) => {
      const favId = typeof fav === "object" ? fav._id : fav;
      return favId === propertyId;
    });
  };

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite,
        isFavorite,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
