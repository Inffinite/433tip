"use client";

import OtherSportForm from "@/app/components/Form/sports/AddOtherSport";
import FootballForm from "@/app/components/Form/sports/AddFootball";
import PaymentForm from "@/app/components/Form/sports/AddPayment";
import AdminForm from "@/app/components/Form/sports/AddAdmin";
import VipForm from "@/app/components/Form/sports/AddVip";
import styles from "@/app/styles/dashboardSingle.module.css";
import { useSearchParams } from "next/navigation";

export default function Form({ params }) {
  const PageName = decodeURIComponent(params.slug || "");

  const searchParams = useSearchParams();
  const Purpose = searchParams.get("form") || "";
  const FormId = searchParams.get("id") || "";

  const renderCardContent = (page) => {
    switch (page) {
      case "football":
        return (
          <FootballForm
            Title={PageName}
            Todo={Purpose}
            FormID={Purpose === "Edit" ? FormId : ""}
          />
        );
      case "other":
        return (
          <OtherSportForm
            Title={PageName}
            Todo={Purpose}
            FormID={Purpose === "Edit" ? FormId : ""}
          />
        );
      case "payment":
        return (
          <PaymentForm
            Title={PageName}
            Todo={Purpose}
            FormID={Purpose === "Edit" ? FormId : ""}
          />
        );
      case "vip":
        return (
          <VipForm
            Title={PageName}
            Todo={Purpose}
            FormID={Purpose === "Edit" ? FormId : ""}
          />
        );
      case "admin":
        return (
          <AdminForm
            Title={PageName}
            Todo={Purpose}
            FormID={Purpose === "Edit" ? FormId : ""}
          />
        );
      default:
        return (
          <FootballForm
            Title={PageName}
            Todo={Purpose}
            FormID={Purpose === "Edit" ? FormId : ""}
          />
        );
    }
  };

  return (
    <div className={styles.dashboardMain}>{renderCardContent(PageName)}</div>
  );
}
