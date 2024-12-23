"use client";

import Image from "next/image";
import { useState } from "react";
import Loader from "@/app/components/loader";
import styles from "@/app/styles/contact.module.css";
import toast from "react-hot-toast";

//social icons
import Instagram from "@/public/icons/instagram.svg";
import Whatsapp from "@/public/icons/whatsapp.svg";
import linkedIn from "@/public/icons/linkedIn.svg";
import Telegram from "@/public/icons/telegram.svg";
import Twitter from "@/public/icons/twitter.svg";
import Youtube from "@/public/icons/youtube.svg";

import { FaRegUser as UserNameIcon } from "react-icons/fa6";
import { MdOutlineEmail as EmailIcon } from "react-icons/md";


export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const socialData = [
    { name: "Twitter", icons: Twitter, link: "https://twitter.com" },
    { name: "Youtube", icons: Youtube, link: "https://youtube.com" },
    { name: "Telegram", icons: Telegram, link: "https://t.me/four_three_three_tips" },
    { name: "linkedIn", icons: linkedIn, link: "https://linkedin.com" },
    { name: "Whatsapp", icons: Whatsapp, link: "https://whatsapp.com" },
    { name: "Instagram", icons: Instagram, link: "https://instagram.com" },
    { name: "Facebook", icons: Instagram, link: "https://instagram.com" },
  ];

  const openLink = (link) => {
    window.open(link, "_blank");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/users/send/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ username: "", email: "",  message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.formContactContainer}>
      <div className={styles.contactWrapinfo}>
        {/* Username */}
        <div className={styles.contactInputContainer}>
          <label htmlFor="username" className={styles.contactLabel}>
            Username
          </label>
          <div className={styles.contactInput}>
            <UserNameIcon
              className={styles.contactIcon}
              alt="Username icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="penguin"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          {errors.username && (
            <p className={styles.errorText}>{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className={styles.contactInputContainer}>
          <label htmlFor="email" className={styles.contactLabel}>
            Email
          </label>
          <div className={styles.contactInput}>
            <EmailIcon
              className={styles.contactIcon}
              alt="email icon"
              width={20}
              height={20}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="penguin@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
        {/* Message */}
        <div className={styles.contactInputContainer}>
          <label htmlFor="message" className={styles.contactLabel}>
            Message
          </label>
          <div className={styles.contactInputTextArea}>
            <textarea
              name="message"
              id="message"
              placeholder="Enter your message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          {errors.message && (
            <p className={styles.errorText}>{errors.message}</p>
          )}
        </div>
        <div className={styles.formcontactBtnWrapper}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.formcontactButton}
          >
            {isLoading ? <Loader /> : "Contact Us"}
          </button>
          <div className={styles.socialContainer}>
            {socialData.map((data, index) => (
              <div
                className={styles.socialIconWrap}
                key={index}
                onClick={() => openLink(data.link)}
              >
                <Image
                  className={styles.socialIcon}
                  src={data.icons}
                  alt={data.name}
                  height={24}
                  priority={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
