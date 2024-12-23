import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SportData from "@/app/utility/data.json";
import styles from "@/app/styles/accounttable.module.css";
import AddPayment from "@/app/components/Form/sports/AddPayment";
import {
  MdDeleteOutline as DeleteIcon,
} from "react-icons/md";
import { GrAdd as AddIcon } from "react-icons/gr";
import { FiEdit as EditIcon } from "react-icons/fi";

export default function DataTable() {
  const [userId, setUserId] = useState(null);



  const handleDelete = (id) => {
    console.log("Deleting data with id:", id);
  };

  const handleEdit = (id) => {
    setUserId(id);
    router.push(`dashboard/payment?form=Edit&id=${id}`, { scroll: false });
  };

  const addTeam = () => {
    router.push(`dashboard/payment?form=Add`, { scroll: false });
  };

  return (
    <div className={styles.dataContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.addContainer} onClick={addTeam}>
          <AddIcon aria-label="download data" className={styles.copyIcon} />
          Add Team
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.sportsTable}>
          <thead>
            <tr>
              <th>league</th>
              <th>team A</th>
              <th>team B</th>
              <th>score</th>
              <th>time</th>
              <th>status</th>
              <th>sport</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SportData.map((data, index) => (
              <tr key={data.index} className={styles.tableRow}>
                <td>{data.league}</td>
                <td>
                  <div className={styles.teamInner}>
                    <Image
                      src={data.teamAImage}
                      alt={`${data.teamA} image`}
                      priority={true}
                      width={30}
                      height={30}
                      className={`${styles.teamImage} ${
                        data.sport === "Tennis" || data.sport === "Basketball"
                          ? styles.circularShape
                          : ""
                      }`}
                    />
                    {data.teamA}
                  </div>
                </td>
                <td>
                  <div className={styles.teamInner}>
                    <Image
                      src={data.teamAImage}
                      alt={`${data.teamA} image`}
                      priority={true}
                      width={30}
                      height={30}
                      className={`${styles.teamImage} ${
                        data.sport === "Tennis" || data.sport === "Basketball"
                          ? styles.circularShape
                          : ""
                      }`}
                    />
                    {data.teamB}
                  </div>
                </td>
                <td>
                  {" "}
                  {data.showScore
                    ? `${data.teamAscore} - ${data.teamBscore}`
                    : "VS"}{" "}
                </td>
                <td>{data.time}</td>
                <td>{data?.status}</td>
                <td>{data.sport}</td>
                
                <td>
                  <EditIcon
                    onClick={() => handleEdit(data.id)}
                    aria-label="edit data"
                    className={styles.editIcon}
                  />
                </td>
                <td>
                  <DeleteIcon
                    onClick={() => handleDelete(data.id)}
                    aria-label="delete data"
                    className={styles.deleteIcon}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
