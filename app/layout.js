import { Toaster } from "react-hot-toast";
import Script from "next/script";
import "@/app/styles/global.css";
import {
  PoppinsBlack,
  PoppinsBold,
  PoppinsExtraBold,
  PoppinsExtraLight,
  PoppinsLight,
  PoppinsMedium,
  PoppinsRegular,
  PoppinsSemiBold,
  PoppinsThin,
} from "@/app/fonts/font";




export const metadata = {
  metadataBase: new URL("https://www.433tips.com/"),
  title: "433Tips - Sports Betting Predictions & Tips",
  applicationName: "433tip",
  author: "433tip",
  images:
    "https://raw.githubusercontent.com/DarknessMonarch/433tip/refs/heads/master/public/assets/banner.png",
  description:
    "Get expert sports betting predictions and tips on football, soccer, basketball, and more at 433Tips. Join us for winning insights and tips to boost your betting game.",
  metadataBase: new URL("https://www.433tips.com/"),
  keywords: [
    "433Tips",
    "sports betting",
    "predictions",
    "tips",
    "football",
    "soccer",
    "basketball",
    "betting strategies",
    "basketball",
  ],
  openGraph: {
    title: "433Tips - Sports Betting Predictions & Tips",
    description:
      "Get expert sports betting predictions and tips on football, soccer, basketball, and more at 433Tips. Join us for winning insights and tips to boost your betting game.",
    url: "https://www.433tips.com/",
    siteName: "433tip",
    images:
      "https://raw.githubusercontent.com/DarknessMonarch/433tip/refs/heads/master/public/assets/banner.png",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0e1a" />
        <head>
          <Script
            async
            src={`https://www.paypal.com/sdk/js?client-id=AecSsqZBM68JtGP4BOA4Agcdk4vDGldQJwYoU83Ig4VM7ItL6Tou_wVnixLw2d0ouZf2ap30kjv4dB-J`}
          ></Script>

          {/* Google tag (gtag.js)  */}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-DWYY7ECRV7"
          ></Script>
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DWYY7ECRV7');
          `}
          </Script>
        </head>
      </head>
      <body className={`
      ${PoppinsBlack.variable}
       ${PoppinsBold.variable} 
       ${PoppinsExtraBold.variable}
        ${PoppinsExtraLight.variable}
         ${PoppinsLight.variable} 
         ${PoppinsMedium.variable} 
         ${PoppinsRegular.variable} 
         ${PoppinsSemiBold.variable}
          ${PoppinsThin.variable}`}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 8000,
            style: {
              background: "#09122eff",
              color: "#6cd7ffff",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
