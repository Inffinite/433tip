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

import { BsQrCode as ForgetCodeIcon } from "react-icons/bs";
export default function Verify() {
  const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [forgetCode, setforgetCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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

  const validateForm = () => {
    if (!forgetCode) {
      setError("Reset code is required");
      return false;
    }
    if (forgetCode.length !== 5) {
      setError("Reset code must be exactly 5 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setforgetCode(value);
    if (value.length > 5) {
      setError("Reset code must be exactly 5 characters long");
    } else {
      setError("");
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    router.push(`reset/${forgetCode}`, { scroll: false });
    setIsLoading(false);
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
            <h1>Forgot password</h1>
            <p>Enter your reset code to reset your password</p>
          </div>
          {/* forgetCode code */}
          <div className={styles.authInput}>
            <ForgetCodeIcon
              className={styles.authIcon}
              alt="forgetCode icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="forgetCode"
              id="forgetCode"
              placeholder="00000"
              value={forgetCode}
              onChange={handleInputChange}
              maxLength={5}
            />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.authBottomBtn}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.formAuthButton}
            >
              {isLoading ? <Loader /> : "Request password reset"}
            </button>
          </div>
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
