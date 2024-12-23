"use client";

import Advert from "@/app/components/Advert";
import data from "@/app/components/data.json";
import SportCard from "@/app/components/cards/SportCard";
import styles from "@/app/styles/football.module.css";
import MobileFilter from "@/app/components/MobileFilter";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function OtherSport() {
  const emptyCardCount = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSport = pathname.split("/").pop();
  const searchKey = searchParams.get("q") || "";
  const dateKey = searchParams.get("date") || "";
  const leagueKey = searchParams.get("league") || "";
  const countryKey = searchParams.get("country") || "";

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
    <div className={styles.footballContainer}>
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
