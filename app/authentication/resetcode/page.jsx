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

import { MdOutlineEmail as EmailIcon } from "react-icons/md";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});

  const images = [auth1Image, auth2Image, auth3Image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();

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

  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { email } = formData;
      const response = await fetch(
        `${SERVER_API}/users/public/forgot/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error getting reset code");
      }
      toast.success(data.message || "Reset code sent");
      router.push("forgot", { scroll: false });
    } catch (error) {
      toast.error(error.message || "Error getting reset code");
    } finally {
      setIsLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className={styles.formContainer}>
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
            <h1>Reset password</h1>
            <p>Enter your email to get the reset code</p>
          </div>

          {/*Email Input */}
          <div className={styles.authInput}>
            <EmailIcon
              className={styles.authIcon}
              alt="Email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          {errors.email && (
            <p className={styles.errorText}>{errors.email}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Request code"}
          </button>

          <h3>
            Already have an account?{" "}
            <div
              className={styles.btnLogin}
              onClick={() => router.push("login", { scroll: false })}
            >
              Login
            </div>
          </h3>
        </form>
      </div>
    </div>
  );
}