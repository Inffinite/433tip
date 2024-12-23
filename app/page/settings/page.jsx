"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import countries from "@/app/utility/Countries";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import styles from "@/app/styles/settings.module.css";
import ProfileImg from "@/public/assets/auth4Image.jpg";

// Icons
import {
  FiEye as ShowPasswordIcon,
  FiEyeOff as HidePasswordIcon,
} from "react-icons/fi";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { RiArrowDropDownLine as DropdownIcon } from "react-icons/ri";

import {
  MdOutlineVpnKey as PasswordIcon,
  MdOutlineEmail as EmailIcon,
  MdModeEdit as EditIcon,
} from "react-icons/md";

export default function Settings() {
  const {
    email,
    isAuth,
    username,
    clearUser,
    profileImage,
    updateUsernameOrEmail,
    updatePassword: storeUpdatePassword,
    updateProfileImage: storeUpdateProfileImage,
    deleteAccount,
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: username,
    email: email,
    oldPassword: "",
    newPassword: "",
    country: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // useEffect(() => {
  //   if (!isAuth) {
  //     redirect("football");
  //   }
  // }, [isAuth]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country: country.code }));
    setSearchTerm(country.name);
    setIsOpen(false);
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please upload an image smaller than 5MB.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        setIsLoading(true);
        try {
          const response = await storeUpdateProfileImage(base64Image);

          // Check for specific error types
          if (response.status === "error") {
            if (response.details?.includes("api_key")) {
              toast.error(
                "Server configuration error. Please contact support."
              );
            } else {
              toast.error(response.message || "Failed to update profile image");
            }
            return;
          }

          if (response.success) {
            toast.success("Profile image updated successfully");
          } else {
            toast.error("Failed to update profile image");
          }
        } catch (error) {
          toast.error("An error occurred while updating profile image");
        } finally {
          setIsLoading(false);
        }
      };
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await updateUsernameOrEmail({
        newUsername: formData.username,
        newEmail: formData.email,
      });

      if (result.success) {
        toast.success(result.message);
        await clearUser();
        router.push("/authentication/login", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await storeUpdatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        toast.success(result.message);
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
        await clearUser();
        router.push("/authentication/login", { scroll: false });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      setIsLoading(true);
      try {
        const response = await deleteAccount();
        if (response.success) {
          toast.success(response.message);
          router.push("/authentication/signup", { scroll: false });
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className={styles.formSettingContainer}>
      <div className={styles.formSettingContainerInner}>
        <div className={styles.settingWrap}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div className={styles.profileSection}>
            <div className={styles.profileImageContain}>
              <Image
                src={profileImage || ProfileImg}
                alt={username}
                className={styles.profileImage}
                width={100}
                height={100}
              />
              <div
                className={styles.uploadEditIcon}
                onClick={() => fileInputRef.current?.click()}
              >
                <EditIcon className={styles.editIcon} alt="Edit Icon" />
              </div>
            </div>
            <div className={styles.profileDetails}>
              <h1>{username}</h1>
              <div className={styles.profileGlass}>
                <h3>{email}</h3>
              </div>
              <div
                onClick={handleDeleteAccount}
                className={styles.deleteAccount}
              >
                <DeleteIcon className={styles.deleteIcon} alt="Delete Icon" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.settingWrapinfo}>
          <form onSubmit={updateProfile} className={styles.settingWrapS}>
            <div className={styles.settingInputContainer}>
              <label htmlFor="username" className={styles.settingLabel}>
                Username
              </label>
              <div className={styles.settingInput}>
                <UserNameIcon
                  className={styles.settingIcon}
                  alt="Username icon"
                  width={20}
                  height={20}
                />
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </div>
              {errors.username && (
                <p className={styles.errorText}>{errors.username}</p>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="email" className={styles.settingLabel}>
                Email
              </label>
              <div className={styles.settingInput}>
                <EmailIcon
                  className={styles.settingIcon}
                  alt="email icon"
                  width={20}
                  height={20}
                />
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>{errors.email}</p>
              )}
            </div>
            {/* Country Dropdown */}
            <div className={styles.settingInputContainer}>
              <label htmlFor="email" className={styles.settingLabel}>
                Country
              </label>
              <div className={styles.settingInput}>
                <CountryIcon
                  height={20}
                  alt="country icon"
                  className={styles.settingIcon}
                />
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
                    height={20}
                    className={`${styles.dropdownIcon} ${
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
            </div>
            {errors.country && (
              <p className={styles.errorText}>{errors.country}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={styles.formsettingButton}
            >
              {isLoading ? <Loader /> : "Update Profile"}
            </button>

            <p className={styles.errorText}>
              After updating you will be logged out
            </p>
          </form>

          <form onSubmit={handleUpdatePassword} className={styles.settingWrapS}>
            <div className={styles.settingInputContainer}>
              <label htmlFor="oldPassword" className={styles.settingLabel}>
                Old Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Old Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.settingInputContainer}>
              <label htmlFor="newPassword" className={styles.settingLabel}>
                New Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.newPassword && Array.isArray(errors.newPassword) && (
                <ul className={styles.errorList}>
                  {errors.newPassword.map((error, index) => (
                    <li key={index} className={styles.errorText}>
                      {error}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.settingInputContainer}>
              <label
                htmlFor="confirmNewPassword"
                className={styles.settingLabel}
              >
                Confirm New Password
              </label>
              <div className={styles.settingInput}>
                <PasswordIcon
                  className={styles.settingIcon}
                  alt="password icon"
                  width={20}
                  height={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  className={styles.showBtn}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <ShowPasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <HidePasswordIcon
                      className={styles.settingIcon}
                      width={20}
                      height={20}
                    />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className={styles.errorText}>{errors.confirmNewPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.formsettingButton}
            >
              {isLoading ? <Loader /> : "Update Password"}
            </button>
            <p className={styles.errorText}>
              After updating your password, you will be logged out
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
