"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";
import styles from "@/app/styles/form.module.css";
import AccountDropdown from "@/app/components/Form/FormDropdown";

const countryOptions = [
  { value: "KE", label: "Kenya" },
  { value: "NG", label: "Nigeria" },
  { value: "CM", label: "Cameroon" },
  { value: "GH", label: "Ghana" },
  { value: "ZA", label: "South Africa" },
  { value: "TZ", label: "Tanzania" },
  { value: "UG", label: "Uganda" },
  { value: "ZM", label: "Zambia" },
  { value: "RW", label: "Rwanda" },
  { value: "MW", label: "Malawi" },
];

export default function AddPaymentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    country: "",
    value: "",
    price: "",
  });

  const handleDropdownChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption.label,
      value: selectedOption.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to process payment");

      toast.success("Payment added successfully");
      router.push("/success-page");
    } catch (error) {
      console.error(error);
      toast.error("Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.formContainer}>
      {/* Country Dropdown */}
      <div className={styles.formInputContainer}>
        <label>Country</label>
        <AccountDropdown
          options={countryOptions}
          dropPlaceHolder="Choose country"
          onSelect={handleDropdownChange}
          value={formData.country}
        />
      </div>

      {/* Price Input */}
      <div className={styles.formInputContainer}>
        <label>Price</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          className={styles.inputField}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className={styles.submitButton}>
        {isLoading ? <Loader /> : "Add Payment"}
      </button>
    </form>
  );
}
