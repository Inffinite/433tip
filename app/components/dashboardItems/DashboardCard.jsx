"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MdAdminPanelSettings as AdminIcon } from "react-icons/md";
import { RiVipCrownLine as VipIcon } from "react-icons/ri";
import { GiMoneyStack as MoneyIcon } from "react-icons/gi";
import { FaUsers as UserIcon } from "react-icons/fa";
import { IoFootball as SportIcon } from "react-icons/io5";
import styles from "@/app/styles/dashboardCard.module.css";

export default function DashboardCard() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const activeCard = searchParams.get('card');

  const dashCardData = [
    {
      name: "revenue",
      icon: MoneyIcon,
      title: "Monthly Revenue",
      revenue: "Ksh 1000",
    },
    {
      name: "users",
      icon: UserIcon,
      title: "Accounts active",
      revenue: "1000",
    },
    {
      name: "vip",
      icon: VipIcon,
      title: "Vip subscriptions",
      revenue: "70",
    },
    {
      name: "admin",
      icon: AdminIcon,
      title: "Admin accounts",
      revenue: "70",
    },
    {
      name: "sports",
      icon: SportIcon,
      title: "Monitor sports",
      revenue: "Active",
    },
  ];

  const handleCardClick = (cardName) => {
    const params = new URLSearchParams(searchParams);
    
    params.set('card', cardName);
    
    if (cardName !== 'sports') {
      params.delete('link');
    }

    if(cardName == 'sports') {
    router.push(`${pathname}?${params.toString()}&link=football`);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.dashcardContainer}>
      {dashCardData.map((data, index) => (
        <div
          className={`${styles.dashcard} ${
            activeCard === data.name ? styles.dashcardActive : ""
          }`}
          onClick={() => handleCardClick(data.name)}
          key={index}
        >
          <div className={styles.dashcardTitle}>
            <h3>{data.title}</h3>
            <div className={styles.dashCardIconWrapper}>
              <data.icon height={30} width={30} className={styles.dashCardIcon} />
            </div>
          </div>
          <h1>{data.revenue}</h1>
        </div>
      ))}
    </div>
  );
}