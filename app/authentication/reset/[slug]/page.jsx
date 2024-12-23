"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Reset({ params }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

  const images = [auth1Image, auth2Image, auth3Image];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
    }

    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const errors = validatePassword(newPassword);
    setPasswordErrors(errors);
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;


  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Validate password
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${SERVER_API}/users/public/update/recover/${params.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }  
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      toast.success("Password reset successful");
      router.push("/authentication/login", { scroll: false });
    } catch (error) {
      toast.error(error.message || "Password reset failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.authComponent}>
      <div className={styles.authComponentBgImage}>
        <Image
          className={styles.authImage}
          src={images[currentImageIndex]}
          alt="auth image"
          layout="fill"
          quality={100}
          objectFit="cover"
          priority={true}
        />
  
      </div>
      <div className={styles.authWrapper}>
        <form onSubmit={onSubmit} className={styles.formContainer}>
          <div className={styles.formLogo}>
            <Image
              className={styles.logo}
              src={LogoImg}
              alt="logo"
              width={100}
              priority={true}
            />
          </div>
          <div className={styles.formHeader}>
            <h1>Reset Password</h1>
            <p>Enter your new Password</p>
          </div>

          {/* Password Input */}
          <div className={styles.authInput}>
            <PasswordIcon
              className={styles.authIcon}
              alt="password icon"
              width={20}
              height={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="New Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <HidePasswordIcon
                  className={styles.authIcon}
                  width={20}
                  height={20}
                />
              ) : (
                <ShowPasswordIcon
                  className={styles.authIcon}
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>

          {passwordErrors.length > 0 &&
            passwordErrors.map((error, index) => (
              <div key={index}>
                <p className={styles.errorText}>{error}</p>
              </div>
            ))}

          {/* Confirm Password */}
          <div className={styles.authInput}>
            <PasswordIcon
              className={styles.authIcon}
              alt="confirm password"
              width={20}
              height={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? (
                <HidePasswordIcon
                  className={styles.authIcon}
                  width={20}
                  height={20}
                />
              ) : (
                <ShowPasswordIcon
                  className={styles.authIcon}
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>
          {confirmPasswordError && (
            <p className={styles.errorText}>{confirmPasswordError}</p>
          )}

          <div className={styles.authBottomBtn}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Reset Password"}
            </button>
          </div>
          <h3>
            Already have an account?{" "}
            <div
              className={styles.btnLogin}
              onClick={() => router.push("/authentication/login", { scroll: false })}
            >
              Login
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
