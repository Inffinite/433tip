"use client";

import Advert from "@/app/components/Advert";
import data from "@/app/utility/data.json";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/vip.module.css";
import SportCard from "@/app/components/cards/SportCard";
import MobileFilter from "@/app/components/MobileFilter";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Vip() {
  const emptyCardCount = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuth, isVip } = useAuthStore();
  const currentSport = pathname.split("/").pop();
  const searchKey = searchParams.get("q") || "";
  const dateKey = searchParams.get("date") || "";
  const leagueKey = searchParams.get("league") || "";
  const countryKey = searchParams.get("country") || "";

  const joinVip = () => {
    router.push("payment", { scroll: false });
  };

  const Login = () => {
    router.push("/authentication/login", { scroll: false });
  };

  if (!isAuth) {
    return (
      <div className={styles.defaultContainer}>
        <div className={styles.defaultContain}>
          <h1>Please login to access vip</h1>
          <button onClick={Login} className={styles.defaultButton}>
            Login
          </button>
        </div>
      </div>
    );
  } else if (!isVip) {
    return (
      <div className={styles.defaultContainer}>
        <div className={styles.defaultContain}>
          <h1>Join vip to access accurate tips </h1>
          <button onClick={joinVip} className={styles.defaultButton}>
            Join vip
          </button>
        </div>
      </div>
    );
  }

  const searchData =
  searchKey || leagueKey || countryKey
    ? data.filter(
        (item) =>
          item.teamA.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.teamB.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.league.toLowerCase().includes(leagueKey.toLowerCase()) ||
          item.country.toLowerCase().includes(countryKey.toLowerCase())
      )
    : data;

const renderEmptyCards = () => {
  return Array(emptyCardCount)
    .fill(0)
    .map((_, index) => (
      <div
        onClick={() => handleCardClick("empty")}
        className={`${styles.emptyCard} skeleton`}
        key={`empty-${index}`}
      ></div>
    ));
};

const handleCardClick = (param) => {
  router.push(`${currentSport}/${param}`, { scroll: false });
};


  return (
    <div className={styles.vipContainer}>
      <Advert />
      <MobileFilter />
      <div className={styles.content}>
        {searchData.length === 0 ? (
          renderEmptyCards()
        ) : (
          <>
            {searchData.map((data, index) => (
              <SportCard
                key={index}
                formationA={data.formationA}
                formationB={data.formationB}
                leagueImage={data.leagueImage}
                teamAImage={data.teamAImage}
                teamBImage={data.teamBImage}
                tip={data.tip}
                league={data.league}
                teamA={data.teamA}
                teamB={data.teamB}
                teamAscore={data.teamAscore}
                teamBscore={data.teamBscore}
                time={data.time}
                status={data.status}
                sport={currentSport}
                showScore={data.showScore}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
