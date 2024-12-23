"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/auth.module.css";
import auth1Image from "@/public/assets/auth1Image.jpg";
import auth2Image from "@/public/assets/auth2Image.jpg";
import auth3Image from "@/public/assets/auth3Image.jpg";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { MdOutlineVpnKey as PasswordIcon } from "react-icons/md";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, toggleAuth } = useAuthStore();
  const [terms, setTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const images = [auth1Image, auth2Image, auth3Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTermsChange = (event) => {
    setTerms(event.target.checked);
    setErrors((prev) => ({ ...prev, terms: "" }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim())
      newErrors.email = "email is required";
    if (!terms) newErrors.terms = "You must accept the terms and conditions";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${SERVER_API}/users/public/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(data.errors || "Login failed");
      }

      const responseData = await response.json();

      const userData = responseData.data;
      setUser(userData);

      toast.success("Welcome");
      router.push("/page/home", { scroll: false });
    } catch (error) {
      toast.error("Login failed, credentials do not match");
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
            <h1>Login</h1>
            <p>Enter your account details</p>
          </div>
          {/* email */}
          <div className={styles.authInput}>
            <UserNameIcon
              className={styles.authIcon}
              alt="email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
            />
          </div>
          {errors.email && (
            <p className={styles.errorText}>{errors.email}</p>
          )}

          {/* Password */}
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
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <ShowPasswordIcon
                  className={styles.authIcon}
                  alt="show icon"
                  width={20}
                  height={20}
                />
              ) : (
                <HidePasswordIcon
                  className={styles.authIcon}
                  alt="hide icon"
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}
          <div className={styles.formChange}>
            <div className={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={handleTermsChange}
              />
              <label
                onClick={() => router.push("/page/terms", { scroll: false })}
                htmlFor="terms"
              >
                Accept terms and conditions
              </label>
            </div>
            {errors.terms && <p className={styles.errorText}>{errors.terms}</p>}
            <span onClick={() => router.push("resetcode", { scroll: false })}>
              Forgot Password
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.formAuthButton} ${
              isLoading ? styles.activeFormAuthButton : ""
            }`}
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
          <h3>
            Don&apos;t have an account?{" "}
            <div
              className={styles.btnLogin}
              onClick={() => router.push("signup", { scroll: false })}
            >
              Sign up
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}
