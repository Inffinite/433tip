"use client";

import Image from "next/image";
import data from "@/app/components/data.json";
import styles from "@/app/styles/single.module.css";
import SingleSportCard from "@/app/components/cards/SingleSportCard";


export default function SingleSport({ params }) {
  const slug = decodeURIComponent(params.slug || "");
  const [teamAPart, teamBPart] = slug.split(" vs ");
  const teamA = teamAPart?.trim() || "";
  const teamB = teamBPart?.trim() || "";

  
  const filteredData = data.filter(
    (item) =>
      item.teamA.toLowerCase() === teamA.toLowerCase() &&
      item.teamB.toLowerCase() === teamB.toLowerCase()
  );


  const getFormationColorClass = (formation) => {
    switch (formation) {
      case "w":
        return styles.win;
      case "d":
        return styles.draw;
      case "l":
        return styles.lose;
      default:
        return styles.defaultColor;
    }
  };

  return (
    <div className={styles.singleContainer}>
      {filteredData.map((match, index) => (
        <SingleSportCard
          key={index}
          leagueImage={match.leagueImage}
          teamAImage={match.teamAImage}
          teamBImage={match.teamBImage}
          tip={match.tip}
          league={match.league}
          teamA={match.teamA}
          teamB={match.teamB}
          teamAscore={match.teamAscore}
          teamBscore={match.teamBscore}
          time={match.time}
          status={match.status}
          sport="football"
          showScore={match.showScore}
          showBtn={match.showBtn}
        />
      ))}
      <div className={styles.singleReviewContainer}>
        <div className={styles.reviewContainer}>
          <div className={styles.reviewStanding}>
            <h1>Standing</h1>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>P</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((match, index) => (
                    <>
                      <tr key={`${index}-teamA`}>
                        <td className={styles.tableData}>
                          <h3>1</h3>
                          <div className={styles.tableInner}>
                            <Image
                              src={match.teamAImage}
                              alt={`${match.teamA} image`}
                              priority={true}
                              width={30}
                              height={30}
                              className={`${styles.teamImage} ${
                                match.sport === "Tennis" ||
                                match.sport === "Basketball"
                                  ? styles.circularShape
                                  : ""
                              }`}
                            />
                            <h2>{match.teamA}</h2>
                          </div>
                        </td>
                        <td>
                          {match.formationA.filter((f) => f === "w").length}
                        </td>
                        <td>
                          {match.formationA.filter((f) => f === "d").length}
                        </td>
                        <td>
                          {match.formationA.filter((f) => f === "l").length}
                        </td>
                        <td>0</td>
                      </tr>
                      <tr key={`${index}-teamB`}>
                        <td className={styles.tableData}>
                          <h3>2</h3>
                          <div className={styles.tableInner}>
                            <Image
                              src={match.teamBImage}
                              alt={`${match.teamB} image`}
                              priority={true}
                              width={30}
                              height={30}
                              className={`${styles.teamImage} ${
                                match.sport === "Tennis" ||
                                match.sport === "Basketball"
                                  ? styles.circularShape
                                  : ""
                              }`}
                            />
                            <h2>{match.teamB}</h2>
                          </div>
                        </td>
                        <td>
                          {match.formationB.filter((f) => f === "w").length}
                        </td>
                        <td>
                          {match.formationB.filter((f) => f === "d").length}
                        </td>
                        <td>
                          {match.formationB.filter((f) => f === "l").length}
                        </td>
                        <td>0</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.reviewFormation}>
            <h1>Formation</h1>
            <div className={styles.innerFormation}>
              {filteredData.map((match, index) => (
                <>
                  <div className={styles.formation} key={index}>
                    <Image
                      src={match.teamAImage}
                      alt={`${match.teamA} image`}
                      priority={true}
                      width={40}
                      height={40}
                      className={`${styles.teamImage} ${
                        match.sport === "Tennis" || match.sport === "Basketball"
                          ? styles.circularShape
                          : ""
                      }`}
                    />

                    {match.formationA.map((result, index) => (
                      <div
                        key={index}
                        className={`${
                          styles.formationCircle
                        } ${getFormationColorClass(result)}`}
                      >
                        <span> {result.toUpperCase()} </span>
                      </div>
                    ))}
                  </div>
                  <h3>vs</h3>
                  <div className={styles.formation} key={index}>
                    <Image
                      src={match.teamBImage}
                      alt={`${match.teamB} image`}
                      priority={true}
                      width={40}
                      height={40}
                      className={`${styles.teamImage} ${
                        match.sport === "Tennis" || match.sport === "Basketball"
                          ? styles.circularShape
                          : ""
                      }`}
                    />

                    {match.formationB.map((result, index) => (
                      <div
                        key={index}
                        className={`${
                          styles.formationCircle
                        } ${getFormationColorClass(result)}`}
                      >
                        <span> {result.toUpperCase()} </span>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.reviewInfoContainer}>
          <h1>Highlights</h1>
          <div className={styles.reviewInfo}>
            <h2>Team info</h2>
            <p>Description</p>
          </div>
        </div>
      </div>
    </div>
  );
}
