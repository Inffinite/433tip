"use client";

import { useAuthStore } from "@/app/store/Auth";

export async function getUserDetails() {
  const { updateUser, accessToken } = useAuthStore.getState();
  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  try {
    const response = await fetch(`${SERVER_API}/users/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const responseData = await response.json();
    const userData = responseData.data;

    updateUser(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
}
