"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import styles from "@/app/styles/form.module.css";
import AccountDropdown from "@/app/components/Form/FormDropdown";
import { BsCameraFill as CameraIcon } from "react-icons/bs";
import { IoIosArrowBack as BackArrow } from "react-icons/io";
import { IoMdAdd as AddIcon } from "react-icons/io";
import { IoMdRemove as RemoveIcon } from "react-icons/io";

const FileInput = ({ onChange, idImage }) => {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`${styles.formChangeUpload} ${
        idImage ? styles.imageUploaded : ""
      }`}
      onClick={handleIconClick}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {idImage ? (
        <Image
          src={idImage}
          alt="Uploaded Image"
          className={styles.IdImage}
          layout="fill"
          quality={100}
          objectFit="cover"
          priority
        />
      ) : (
        <CameraIcon
          className={styles.CameraIcon}
          alt="Camera Icon"
          width={30}
          height={30}
        />
      )}
    </div>
  );
};

const dropdownData = [
  { value: "W", label: "Win" },
  { value: "L", label: "Loss" },
  { value: "D", label: "Draw" },
];

const FormationSection = ({ team, formations, onFormationsChange }) => {
  const [currentFormation, setCurrentFormation] = useState(null);

  const handleAdd = () => {
    if (currentFormation && formations.length < 5) {
      onFormationsChange([...formations, currentFormation]);
      setCurrentFormation(null);
    } else {
      toast.error("you can't add more than 5")
    }

  };

  const handleRemove = (index) => {
    const newFormations = formations.filter((_, i) => i !== index);
    onFormationsChange(newFormations);
  };

  return (
    <div className={styles.formInputContainer}>
      <label>Formation {team}</label>

      <div className={styles.formationInput}>
        <AccountDropdown
          options={dropdownData}
          dropPlaceHolder="Choose formation"
          onSelect={(selectedOption) =>
            setCurrentFormation(selectedOption.value)
          }
          value={
            currentFormation
              ? dropdownData.find((option) => option.value === currentFormation)
                  ?.label
              : ""
          }
        />
        <button
          type="button"
          onClick={handleAdd}
          className={styles.addButton}
          disabled={!currentFormation || formations.length >= 5}
        >
          <AddIcon
            className={styles.addIcon}
            aria-label="add icon"
            alt="add icon"
          />
        </button>
      </div>

      <div className={styles.formationList}>
        {formations.map((formation, index) => (
          <div key={index} className={styles.formationItem}>
            <span>
              {dropdownData.find((option) => option.value === formation)?.label}
            </span>
            <div
              className={styles.removeContainer}
              onClick={() => handleRemove(index)}
            >
              <RemoveIcon
                className={styles.removeIcon}
                aria-label="remove icon"
                alt="remove icon"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AddAdmin({ Title, Todo, FormID }) {
  const router = useRouter();
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [imageUrls, setImageUrls] = useState({
    leagueImage: null,
    teamAImage: null,
    teamBImage: null,
  });

  const [formationA, setFormationA] = useState([]);
  const [formationB, setFormationB] = useState([]);

  const [formData, setFormData] = useState({
    league: "",
    teamA: "",
    teamB: "",
    country: "",
    teamAscore: "",
    teamBscore: "",
    tip: "",
    time: "",
    sport: "football",
    showScore: false,
    showBtn: true,
    status: "",
  });

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrls((prev) => ({ ...prev, [field]: imageUrl }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const payload = {
      ...formData,
      formationA,
      formationB,
      ...imageUrls,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit");

      toast.success("Sport added successfully");
      router.push("/success-page");
    } catch (error) {
      console.error(error);
      toast.error("Sport not added");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <div onClick={goBack} className={styles.backButton}>
          <BackArrow
            className={styles.backButtonIcon}
            aria-label="back icon"
            alt="back icon"
          />
        </div>
        <h1>{` ${Todo} ${Title}`}</h1>
      </div>
      <form onSubmit={onSubmit} className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formImageContainer}>
            {["leagueImage", "teamAImage", "teamBImage"].map((field) => (
              <div key={field} className={styles.formInputWrapper}>
                <label>{field.replace(/Image/, " Image")}</label>
                <FileInput
                  onChange={(e) => handleImageUpload(e, field)}
                  idImage={imageUrls[field]}
                />
              </div>
            ))}
          </div>

          <div className={styles.formInputContainer}>
            <label>League</label>
            <input
              type="text"
              name="league"
              value={formData.league}
              onChange={handleChange}
              placeholder="League Name"
              className={styles.inputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className={styles.inputField}
            />
          </div>

          {["A", "B"].map((team) => (
            <div
              key={team}
              className={`${styles.formInputContainer} ${styles.formTeamWrapper}`}
            >
              <div className={styles.formTeamContainer}>
                <label>Team {team}</label>
                <input
                  type="text"
                  name={`team${team}`}
                  value={formData[`team${team}`]}
                  onChange={handleChange}
                  placeholder={`Team ${team} Name`}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formTeamContainer}>
                <label>Score</label>
                <input
                  type="text"
                  name={`team${team}score`}
                  value={formData[`team${team}score`]}
                  onChange={handleChange}
                  placeholder="Score"
                  className={styles.inputField}
                />
              </div>
            </div>
          ))}

          <FormationSection
            team="A"
            formations={formationA}
            onFormationsChange={setFormationA}
          />
          <FormationSection
            team="B"
            formations={formationB}
            onFormationsChange={setFormationB}
          />
          <div className={styles.formInputContainer}>
            <label>Tip</label>
            <input
              type="text"
              name="tip"
              value={formData.tip}
              onChange={handleChange}
              placeholder="Tip"
              className={styles.inputField}
            />
          </div>
          <div className={styles.formInputContainer}>
            <label>Time</label>
            <input
              type="datetime-local"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          {isLoading ? <Loader /> : "Add Football"}
        </button>
      </form>
    </div>
  );
}
