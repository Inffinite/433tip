"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import MobileDropdown from "@/app/components/MobileDropdown";
import styles from "@/app/styles/mobileFilter.module.css";
import { BiWorld as CountryIcon } from "react-icons/bi";
import { BiFootball as FootballIcon } from "react-icons/bi";
import date from "date-and-time";

export default function MobileFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastParam = decodeURIComponent(pathname.split("/").pop());

  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get("date");
    return dateParam || date.format(new Date(), "DD-MM-YYYY");
  });
  const [league, setLeague] = useState(searchParams.get("league") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "");

  const countryData = ["Europe", "Kenya", "South Africa"];
  const leagueData = ["Europa", "Copa America", "Bundesliga",];

  const currentDate = date.format(new Date(), "DD-MM-YYYY");

  const updateURL = useMemo(
    () =>
      debounce((params) => {
        const urlParams = new URLSearchParams(searchParams);
        
        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            urlParams.set(key, value);
          } else {
            urlParams.delete(key);
          }
        });

        router.replace(`${pathname}?${urlParams}`);
      }, 300),
    [pathname, router, searchParams]
  );

  useEffect(() => {
    updateURL({
      date: selectedDate !== currentDate ? selectedDate : "",
      league,
      country
    });

    return () => updateURL.cancel();
  }, [selectedDate, league, country, currentDate, updateURL]);

  const handleLeagueSelect = useCallback((selectedValue) => {
    setLeague(selectedValue);
  }, []);

  const handleCountrySelect = useCallback((selectedValue) => {
    setCountry(selectedValue);
  }, []);

  const handleDateChange = useCallback((e) => {
    const rawDate = new Date(e.target.value);
    const formattedDate = date.format(rawDate, "DD-MM-YYYY");
    setSelectedDate(formattedDate);
  }, []);

  return (
    <div className={styles.mobileFilterContainer}>
      <div className={styles.mobileFilterHead}>
        <h1>{lastParam} betting tips and prediction</h1>
        <h2>({selectedDate || currentDate})</h2>
      </div>
      <div className={styles.filterInner}>
        <MobileDropdown
          options={leagueData}
          Icon={
            <FootballIcon
              className={styles.filterIcon}
              aria-label="league icon"
            />
          }
          dropPlaceHolder="League"
          onSelect={handleLeagueSelect}
          value={league}
        />

        <MobileDropdown
          options={countryData}
          Icon={
            <CountryIcon
              className={styles.filterIcon}
              aria-label="country icon"
            />
          }
          dropPlaceHolder="Country"
          onSelect={handleCountrySelect}
          value={country}
        />

        <div className={styles.filterDate}>
          <input
            type="date"
            className={styles.dateInput}
            onChange={handleDateChange}
            value={selectedDate ? date.format(new Date(selectedDate), "YYYY-MM-DD") : ""}
          />
        </div>
      </div>
    </div>
  );
}

const debounce = (func, wait) => {
  let timeout;
  const debouncedFunc = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debouncedFunc.cancel = () => clearTimeout(timeout);
  return debouncedFunc;
};