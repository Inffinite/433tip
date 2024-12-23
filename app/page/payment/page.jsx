"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "@/app/styles/payment.module.css";
import countryData from "@/app/utility/Countries";
import paymentData from "@/app/utility/payment.json";
import {
  RiArrowDropDownLine as DropdownIcon,
  RiSearch2Line as SearchIcon,
} from "react-icons/ri";

const SearchBar = ({ value, onChange, className }) => (
  <div className={styles.searchContainer}>
    <SearchIcon className={styles.searchIcon} aria-label="Search" />
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

export default function Payment() {
  const [country, setCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  const countriesWithSpecificPricing = new Set(
    paymentData
      .filter((plan) => plan.country !== "Others")
      .map((plan) => plan.country)
  );

  const handleSelect = (option) => {
    setCountry(option.name);
    setSearch("");
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setIsOpen(true);
  };

  const filteredCountries = countryData.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getPaymentData = (selectedCountry) => {
    if (!selectedCountry) return [];

    if (countriesWithSpecificPricing.has(selectedCountry)) {
      return paymentData.filter((d) => d.country === selectedCountry);
    }
    return paymentData.filter((d) => d.country === "Others");
  };

  const paymentMethodData = getPaymentData(country);

  const goToPayment = (price, plan) => {
    router.push(`payment/${country}?plan=${plan}&price=${price}&currency=${paymentMethodData[0].value}`, {
      scroll: false,
    });
  };
  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentHeader}>
        <h1>Choose your country to get payment method</h1>
        <h1>
          <span>VIP subscription </span> is valid for 30 days with no extra
          charges
        </h1>
        <h1>
        Your  VIP account will be activated once your payment is recieved
        </h1>
      </div>
      <div className={styles.searchDropdownWrapper}>
        <SearchBar
          value={search}
          onChange={handleInputChange}
          className={styles.desktopSearch}
        />
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <div
            className={styles.dropdownInput}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{country || "Select Country"}</span>
            <DropdownIcon
              className={styles.dropdownIcon}
              aria-label="Dropdown icon"
            />
          </div>

          {(isOpen || search) && countryData && countryData.length > 0 && (
            <div className={styles.dropdownArea}>
              {filteredCountries.map((country) => (
                <span
                  key={country.code}
                  className={styles.dropdownOption}
                  onClick={() => handleSelect(country)}
                >
                  {country.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {paymentMethodData.map((data, index) => (
        <div key={`payment-section-${index}`} className={styles.paymentSection}>
          <div className={styles.payCard}>
            <h1>Weekly plan</h1>
            <div className={styles.payCardInner}>
              <div className={styles.paymentInfo}>
                <span>{data.value}</span>
                <h2>{data.weekly}</h2>
                <span>/weekly</span>
              </div>
              <button
                onClick={() => goToPayment(data.weekly, "Weekly")}
                className={styles.chooseButton}
              >
                Choose plan
              </button>
            </div>
          </div>
          <div className={styles.payCard}>
            <h1>Monthly plan</h1>
            <div className={styles.payCardInner}>
              <div className={styles.paymentInfo}>
                <span>{data.value}</span>
                <h2>{data.monthly}</h2>
                <span>/monthly</span>
              </div>
              <button
                onClick={() => goToPayment(data.weekly, "Monthly")}
                className={styles.chooseButton}
              >
                Choose plan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
