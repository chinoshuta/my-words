import { signIn } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import styles from "./login.module.scss";
import clsx from "clsx";
import { CircularProgress } from "@mui/material";

const pageTitle = "My Words";
const logo = "/favicon.ico";
const description = "自分だけの単語帳を作成";

export default function Login() {
  const [loading, setLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const { query } = useRouter();
  const { error } = query;

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" type="image/x-icon" href={logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={logo} />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={pageTitle} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={logo} />
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logo} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={logo} />
      </Head>
      <div className={styles.container}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-5xl font-extrabold text-gray-900">
            My Words
          </h2>
        </div>

        <button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            signIn("github");
          }}
          className={clsx(styles.button)}
        >
          <img src="/github-icon.png" alt="github" className={styles.icon} />
          <span className="font-bold">GitHub</span>でログイン
        </button>
      </div>
      <Toaster />
    </>
  );
}
