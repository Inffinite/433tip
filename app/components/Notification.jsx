"use client";

import Image from "next/image";
import EmptyImg from "@/public/assets/empty.png";
import ProfileImage from "@/public/assets/banner.png";
import styles from "@/app/styles/notification.module.css";
import { useNotificationStore } from "@/app/store/Notification";

import {
  FaBell as OnNotificationIcon,
  FaBellSlash as CancelNotificationIcon,
} from "react-icons/fa";

import { MdDeleteOutline as DeleteIcon } from "react-icons/md";

export default function Notification() {
  const { isNotificationOn, toggleNotificationOn } = useNotificationStore();

  const NotificationIcon = isNotificationOn
    ? OnNotificationIcon
    : CancelNotificationIcon;

  const data = [];

  const deleteNotification = () => {
    data.pop();
  };

  return (
    <div className={styles.notificationComponent}>
      <div className={styles.notificationHeader}>
        <h1>Notifications</h1>
        <p>
          {data.length === 0
            ? "No notification"
            : isNotificationOn
            ? "Mark all as read"
            : "Unmark all as read"}
        </p>
      </div>
      <div className={styles.alertNotificationComponent}>
        <div className={styles.alertNotification}>
          <div className={styles.alertContainer}>
            <NotificationIcon
              className={styles.notificationIcon}
              alt="allow notification icon"
              width={50}
              height={50}
            />

            {isNotificationOn ? (
              <div className={styles.alertInfo}>
                <h1>Push Notifications Enabled</h1>
                <p>Automatically receive new notifications</p>
              </div>
            ) : (
              <div className={styles.alertInfo}>
                <h1>Push Notifications disabled</h1>
                <p>No notification will be received</p>
              </div>
            )}
          </div>

          <div
            className={`${styles.toggleNotification} ${
              isNotificationOn ? styles.moveDot : ""
            }`}
            onClick={toggleNotificationOn}
          >
            <div className={styles.toggleDot}></div>
          </div>
        </div>
      </div>
      <div className={styles.notificationAreaComponent}>
        {data.length !== 0 ? (
          data.map((notification) => (
            <div className={styles.notificationArea} key={notification.id}>
              <div className={styles.notification}>
                <Image
                  className={styles.notificationProfileImage}
                  src={notification.profileImage}
                  alt="Notification Profile Image"
                  width={50}
                  height={50}
                  priority
                />
                <div className={styles.notificationInfo}>
                  <h1>{notification.name}</h1>
                  <p>{notification.message}</p>
                </div>
              </div>
              <DeleteIcon
                className={styles.deleteNotificationIcon}
                onClick={deleteNotification}
                alt="Delete icon"
                height={20}
              />
            </div>
          ))
        ) : (
          <div className={styles.noNotificationArea}>
            <Image
              src={EmptyImg}
              alt="no notification image"
              width={150}
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
