import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "../../lib/useRequireAuth";
import Header from "../Header";

import type { WithChildren } from "@/types";
import { CircularProgress } from "@mui/material";

interface LayoutProps extends WithChildren {
  siteId?: string;
}

export default function Layout({ siteId, children }: LayoutProps) {
  const title = "My Words";
  const description = "自分だけの単語帳を作成";
  const logo = "/favicon.ico";

  const session = useRequireAuth();
  if (!session) return <CircularProgress />;

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Vercel" />
          <meta name="twitter:creator" content="@StevenTey" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>
        <Header />

        <div className="p-6">{children}</div>
      </div>
    </>
  );
}
