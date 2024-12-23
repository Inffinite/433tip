import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ToggleBar from "@/app/components/ToggleBar";
import styles from "@/app/styles/accounttable.module.css";
import AccountDropdown from "@/app/components/AccountDropdown";
import { useMemo, useState, useEffect, useCallback } from "react";
import { HiOutlineDownload as DownloadIcon } from "react-icons/hi";
import {
  MdDeleteOutline as DeleteIcon,
  MdOutlineEmail as EmailIcon,
} from "react-icons/md";
import { IoCopy as CopyIcon } from "react-icons/io5";
export default function AccountTable() {
  const [isVip, setVip] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();

  const accountsData = useMemo(
    () => [
      {
        id: 1,
        username: "collins",
        email: "collins@gmail.com",
        country: "Kenya",
        activationDate: "20-11-2024-12hr",
        isVip: true,
        isAdmin: true,
        plan: "Weekly",
      },
      {
        id: 2,
        username: "alex",
        email: "alex@gmail.com",
        country: "Kenya",
        activationDate: "20-11-2024-12hr",
        isVip: true,
        isAdmin: true,
        plan: "Weekly",
      },
      {
        id: 3,
        username: "maria",
        email: "maria@gmail.com",
        country: "Kenya",
        activationDate: "20-11-2024-12hr",
        isVip: true,
        isAdmin: true,
        plan: "Weekly",
      },
    ],
    []
  );

  const data = ["Weekly", "Monthly"];

  const handleToggle = () => {
    setVip(!isVip);
  };

  const handleAccountSelect = useCallback((selectedValue) => {
    setSelectedPlan(selectedValue);
  }, []);

  const fetchGmailAccounts = useCallback(() => {
    const gmailEmails = accountsData
      .filter((account) => account.email.endsWith("@gmail.com"))
      .map((account) => account.email)
      .join(", ");

    navigator.clipboard
      .writeText(gmailEmails)
      .then(() => toast.success("Emails copied to clipboard successfully!"))
      .catch(() => toast.error("Failed to copy emails to clipboard."));
  }, [accountsData]);

  const handleDelete = useCallback((id) => {
    console.log("Deleting account with id:", id);
  }, []);

  const handleToggleVipStatus = useCallback((id) => {
    console.log("Toggling VIP status for account with id:", id);
  });

  const downloadEmail = useCallback(() => {
    const emailList = accountsData.map((account) => account.email).join("\n");
    const blob = new Blob([emailList], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "emails.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Emails downloaded successfully!");
  }, [accountsData]);

  const sendSubcriptionEmail = () => {
    toast.success("vip subsctipions sent");
  };

  return (
    <div className={styles.accountContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.copyContainer} onClick={downloadEmail}>
          <DownloadIcon
            aria-label="download icon"
            className={styles.copyIcon}
          />
          Emails
        </div>
        
        <div className={styles.copyContainer} onClick={sendSubcriptionEmail}>
          <EmailIcon aria-label="email icon" className={styles.copyIcon} />
          Subcriptions
        </div>
        <div className={styles.copyContainer} onClick={fetchGmailAccounts}>
          <CopyIcon aria-label="copy icon" className={styles.copyIcon} />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.sportsTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Country</th>
              <th>VIP Status</th>
              <th>VIP Plan</th>
              <th>Activation Date</th>
              <th>Toggle vip</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accountsData.map((account) => (
              <tr key={account.id} className={styles.tableRow}>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.country}</td>
                <td>{account.isVip ? "VIP" : "Standard"}</td>
                <td>
                  <AccountDropdown
                    options={data}
                    dropPlaceHolder="Choose plan"
                    onSelect={handleAccountSelect}
                    value={selectedPlan}
                  />
                </td>
                <td>{account.activationDate}</td>
                <td>
                  <ToggleBar
                    Position={isVip}
                    Toggle={handleToggle}
                    Placeholder={isVip ? "Deactivate" : "Activate"}
                  />
                </td>
                <td>
                  <DeleteIcon
                    onClick={() => handleDelete(account.id)}
                    aria-label="delete account"
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
