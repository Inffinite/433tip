"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useAuthStore } from "@/app/store/Auth";
import countries from "@/app/utility/Countries";
import { useState, useEffect, useRef } from "react";
import Loader from "@/app/components/Loader";
import LogoImg from "@/public/assets/logo.png";
import styles from "@/app/styles/auth.module.css";
import { useRouter } from "next/navigation";

import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { setUser, accessToken } = useAuthStore.getState();

  const dropdownRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    confirmPassword: "",
  });

  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const images = [
    "/assets/auth1Image.jpg",
    "/assets/auth2Image.jpg",
    "/assets/auth3Image.jpg",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country: country.code }));
    setSearchTerm(country.name);
    setIsOpen(false);
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTermsChange = (e) => {
    setTerms(e.target.checked);
    setErrors((prev) => ({ ...prev, terms: "" }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const passwordErrors = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordErrors }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.country) newErrors.country = "Country is required";
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!terms) newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${SERVER_API}/users/public/promoters/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      setUser(data);

      if (!response.ok) {
        throw new Error(data.errors || "Sign up failed");
      }

      toast.success(
        data.message ||
          "Sign up successful! Please check your email for verification."
      );
      router.push("verification", { scroll: false });
    } catch (error) {
      toast.error(error.message || "Sign up failed");
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
            <h1>Sign up</h1>
            <p>Enter your account details</p>
          </div>

          {/* Username */}
          <div className={styles.authInput}>
            <UserNameIcon alt="username icon" className={styles.authIcon} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
          </div>
          {errors.username && (
            <p className={styles.errorText}>{errors.username}</p>
          )}

          {/* Email */}
          <div className={styles.authInput}>
            <EmailIcon alt="email icon" className={styles.authIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}

          {/* Country Dropdown */}
          <div className={styles.authInput}>
            <CountryIcon alt="country icon" className={styles.authIcon} />
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onClick={() => setIsOpen(true)}
                placeholder="Search Country"
                className={styles.dropdownInput}
              />
              <DropdownIcon
                alt="dropdown icon"
                className={`${styles.authIcon} ${
                  isOpen ? styles.open : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <div className={styles.dropdownArea}>
                  {filteredCountries.map((country) => (
                    <span
                      key={country.code}
                      className={styles.dropdownOption}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {errors.country && (
            <p className={styles.errorText}>{errors.country}</p>
          )}
          {/* Password */}
          <div className={styles.authInput}>
            <PasswordIcon alt="password icon" className={styles.authIcon} />
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
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword ? (
                <HidePasswordIcon
                  alt="hide password icon"
                  className={styles.authIcon}
                />
              ) : (
                <ShowPasswordIcon
                  alt="show password icon"
                  className={styles.authIcon}
                />
              )}
            </button>
          </div>
          {errors.password &&
            Array.isArray(errors.password) &&
            errors.password.map((error, index) => (
              <p key={index} className={styles.errorText}>
                {error}
              </p>
            ))}

          {/* Confirm Password */}
          <div className={styles.authInput}>
            <PasswordIcon alt="password icon" className={styles.authIcon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
            <button
              type="button"
              className={styles.showBtn}
              onClick={() => togglePasswordVisibility("confirmPassword")}
            >
              {showConfirmPassword ? (
                <HidePasswordIcon
                  alt="hide password icon"
                  className={styles.authIcon}
                />
              ) : (
                <ShowPasswordIcon
                  alt="show password icon"
                  className={styles.authIcon}
                />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className={styles.errorText}>{errors.confirmPassword}</p>
          )}

          {/* Terms and Conditions */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formAuthButton}
          >
            {isLoading ? <Loader /> : "Sign up"}
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
