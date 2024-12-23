import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      profileImage: "",
      referralCode: "",
      isVip: false,
      accessToken: "",
      refreshToken: "",
      lastLogin: null,
      tokenExpirationTime: null,
      refreshTimeoutId: null,

      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
        set({
          isAuth: true,
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          profileImage: userData.profileImage,
          referralCode: userData.referralCode,
          isVip: userData.isVip,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          lastLogin: userData.lastLogin,
          tokenExpirationTime,
        });
        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set({
          username: userData.username,
          email: userData.email,
          profileImage: userData.profileImage,
          isVip: userData.isVip,
        });
      },

      clearUser: () => {
        get().cancelTokenRefresh();
        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          profileImage: "",
          referralCode: "",
          isVip: false,
          accessToken: "",
          refreshToken: "",
          lastLogin: null,
          tokenExpirationTime: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          get().clearUser();
          return false;
        }

        try {
          const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const data = await response.json();

          if (data.status === "success" && data.data) {
            const tokenExpirationTime = Date.now() + 14 * 60 * 1000; // 14 minutes
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              tokenExpirationTime,
            });
            get().scheduleTokenRefresh();
            return true;
          }

          throw new Error("Invalid response from refresh token endpoint");
        } catch (error) {
          console.error("Error refreshing token:", error);
          get().clearUser();
          return false;
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();

        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        // Refresh 1 minute before expiration
        const timeUntilRefresh = Math.max(
          0,
          tokenExpirationTime - Date.now() - 60000
        );

        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (data.status === "success") {
            get().setUser(data.data);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, message: "An error occurred during login" };
        }
      },

      register: async (userData) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (data.status === "success") {
            get().setUser(data.data);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return {
            success: false,
            message: "An error occurred during registration",
          };
        }
      },

      logout: async () => {
        try {
          const { accessToken } = get();
          await fetch(`${SERVER_API}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          get().clearUser();
          return true;
        } catch (error) {
          return false;
        }
      },

      updateUsernameOrEmail: async (updateData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();

          if (data.user) {
            get().updateUser(data.user);
          }

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          return {
            success: false,
            message: "An error occurred while updating profile",
          };
        }
      },

      updatePassword: async (passwordData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(passwordData),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Update password error:", error);
          return {
            success: false,
            message: "An error occurred while updating password",
          };
        }
      },

      updateProfileImage: async (imageData) => {
        try {
          const { accessToken } = get();

          if (!accessToken) {
            return {
              success: false,
              message: "Access token expired, login again",
            };
          }

          const response = await fetch(`${SERVER_API}/auth/profile-image`, {
            credentials: 'include',
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ image: imageData }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ profileImage: data.user.profileImage });
            return {
              success: true,
              message: data.message,
            };
          }

          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Profile image update error:", error);
          return false;
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-link`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Password reset request error:", error);
          return {
            success: false,
            message: data.message,
          };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, newPassword }),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Password reset error:", error);
          return {
            success: false,
            message: data.message,
          };
        }
      },

      toggleAuthorization: async (authData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/authorize`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(authData),
          });

          const data = await response.json();

          if (data.status === "success") {
            return {
              success: true,
              message: data.message,
              userData: data.data,
            };
          }
          return {
            success: false,
            message: data.message,
          };
        } catch (error) {
          console.error("Toggle authorization error:", error);
          return {
            success: false,
            message: "An error occurred while toggling authorization",
          };
        }
      },

      deleteAccount: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/delete`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            get().clearUser();
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        const timeUntilRefresh = tokenExpirationTime - Date.now() - 60000; // Refresh 1 minute before expiration
        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
