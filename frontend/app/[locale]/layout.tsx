import type { Metadata } from "next";
import "@/styles/globals.scss";
import "@/styles/tailwind.css";
import siteMetadata from "@/data/siteMetadata";
import Script from "next/script";
import CustomQueryClientProvider from "@/components/Common/CustomQueryClientProvider";
import CustomSessionProvider from "@/components/Common/CustomSessionProvider";
import ReduxStoreProvider from "@/components/Common/ReduxStoreProvider";
import { NextIntlClientProvider, useMessages } from "next-intl";
import GlobalErrorHandler from "@/components/Common/GlobalErrorHandler";
import SocketIO from "@/components/SocketIO";
import { Toaster } from "react-hot-toast";
import { FC, ReactNode } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Karla, Rubik } from "next/font/google";
import clsx from "clsx";
import MuiThemeProvider from "@/components/Common/ThemeProvider";
import configService from "@/features/config/configService";
import GlobalConfig from "@/components/GlobalConfig";
import Fathom from "@/components/Fathom";

config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: "./",
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: "summary_large_image",
    images: [siteMetadata.socialBanner],
  },
};

const karlaFont = Karla({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-karla",
});

const rubikFont = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-rubik",
});

interface Props {
  children: ReactNode;
  params: {
    locale: "fr" | "en";
  };
}

const RootLayout: FC<Props> = ({ children, params: { locale } }) => {
  const messages = useMessages();

  return (
    <>
      <Script id="hotjarAnalytics" strategy="afterInteractive">
        {`
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3531486,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `}
      </Script>
      <CustomQueryClientProvider>
        <CustomSessionProvider>
          <ReduxStoreProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <html
                lang={locale}
                className={clsx(karlaFont.variable, rubikFont.variable)}
              >
                <link
                  rel="icon"
                  type="image/png"
                  sizes="32x32"
                  href="/images/favicon-32x32.png"
                />
                <link
                  rel="icon"
                  type="image/png"
                  sizes="16x16"
                  href="/images/favicon-16x16.png"
                />
                <body>
                  <Toaster position="bottom-center" />
                  <MuiThemeProvider
                    fonts={[
                      karlaFont.style.fontFamily,
                      rubikFont.style.fontFamily,
                      "sans-serif",
                    ].join(",")}
                  >
                    <GlobalConfig>{children}</GlobalConfig>
                  </MuiThemeProvider>
                  <Fathom />
                  <SocketIO />
                  <GlobalErrorHandler />
                </body>
              </html>
            </NextIntlClientProvider>
          </ReduxStoreProvider>
        </CustomSessionProvider>
      </CustomQueryClientProvider>
    </>
  );
};

export default RootLayout;
