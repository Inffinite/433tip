"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import Loading from "@/app/components/Loader";
import { useAuthStore } from "@/app/store/Auth";
import { useDrawerStore } from "@/app/store/Drawer";
import styles from "@/app/styles/navbar.module.css";
import ProfileImg from "@/public/assets/auth4Image.jpg";
import Notification from "@/app/components/Notification";
import Popup from "@/app/components/dashboardItems/Popup";
import { useNotificationStore } from "@/app/store/Notification";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  RiMenu4Fill as MenuIcon,
  RiSearch2Line as SearchIcon,
  RiUserLine as UserIcon,
} from "react-icons/ri";

import {
  FaBell as NotificationOnIcon,
  FaBellSlash as NotificationOffIcon,
} from "react-icons/fa";

import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";

const SearchBar = ({ value, onChange, className }) => (
  <div className={`${styles.searchContainer} ${className}`}>
    <SearchIcon
      alt="search icon"
      className={styles.searchIcon}
      aria-label="Search"
    />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search ..."
      className={styles.searchInput}
      aria-label="Search input"
    />
  </div>
);

export default function NavbarComponent() {
  const { isNotificationOn, openNotification, toggleNotification } =
    useNotificationStore();
  const [profile, setProfile] = useState(ProfileImg);
  const [username, setUsername] = useState("penguin");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, toggleOpen } = useDrawerStore();
  const [isMobile, setIsMobile] = useState(false);
  const { isAuth, toggleAuth } = useAuthStore();
  const [status, setStatus] = useState("user");
  const [search, setSearch] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSearchablePage =
    pathname === "/page/football" ||
    pathname === "/page/otherSport" ||
    pathname === "/page/vip";

  const performSearch = useMemo(
    () =>
      debounce((searchValue) => {
        const params = new URLSearchParams(searchParams);
        if (searchValue) {
          params.set("q", searchValue);
        } else {
          params.delete("q");
        }
        router.replace(`${pathname}?${params}`);
      }, 300),
    [searchParams, router, pathname]
  );

  useEffect(() => {
    performSearch(search.trim());

    return () => performSearch.cancel();
  }, [search, performSearch, isSearchablePage]);

  const handleInputChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoading(true);
    try {
      toggleAuth(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  }, [toggleAuth]);

  const handleLogin = useCallback(() => {
    setIsLoading(true);
    try {
      toggleAuth(true);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  }, [toggleAuth]);

  return (
    <>
      <div className={styles.navMain}>
        <div className={styles.navContainer}>
          <div className={styles.navContainerLeft}>
            {!isOpen && (
              <MenuIcon
                onClick={toggleOpen}
                className={styles.menuIcon}
                aria-label="Toggle menu"
                alt="toggle menu icon"
              />
            )}
            {isSearchablePage ? (
              <SearchBar
                value={search}
                onChange={handleInputChange}
                className={styles.desktopSearch}
              />
            ) : isAuth && !isMobile ? (
              <div className={styles.userProfile}>
                <Image
                  src={profile}
                  height={35}
                  width={35}
                  alt={`${username}'s profile`}
                  priority
                  className={styles.profileImg}
                />
                {!isMobile && (
                  <div className={styles.userProfileInfo}>
                    <h1>{username}</h1>
                    <span>[{status}]</span>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>

          {isAuth ? (
            <div
              className={styles.userSection}
              style={{ width: !isOpen || isMobile ? "auto" : "" }}
            >
              {(isMobile || isSearchablePage) && (
                <div className={styles.userProfile}>
                  <Image
                    src={profile}
                    height={35}
                    width={35}
                    alt={`${username}'s profile`}
                    priority
                    className={styles.profileImg}
                  />
                  {!isMobile && (
                    <div className={styles.userProfileInfo}>
                      <h1>{username}</h1>
                      <span>[{status}]</span>
                    </div>
                  )}
                </div>
              )}

              <div
                className={`${styles.notificationContainer} ${
                  isNotificationOn ? styles.activeNotification : ""
                }`}
                onClick={toggleNotification}
              >
                {isNotificationOn ? (
                  <div className={styles.notificationStatus}>
                    <span>0</span>
                    <NotificationOnIcon className={styles.notificationIcon} />
                  </div>
                ) : (
                  <NotificationOffIcon className={styles.notificationIcon} />
                )}
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={styles.userButton}
                aria-label="Logout"
              >
                {isLoading ? (
                  <Loading />
                ) : (
                  <LogoutIcon className={styles.userIcon} />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={styles.userButton}
              aria-label="Login"
            >
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <UserIcon alt="user icon" className={styles.userIcon} />
                  <span>Login</span>
                </>
              )}
            </button>
          )}
        </div>
        {/* Mobile search bar */}
        {isSearchablePage ? (
          <SearchBar
            value={search}
            onChange={handleInputChange}
            className={styles.mobileSearch}
          />
        ) : (
          ""
        )}
      </div>
      <Popup
        Open={openNotification}
        Close={toggleNotification}
        Content={<Notification />}
      />
    </>
  );
}
