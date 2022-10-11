import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";

import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Word } from "@prisma/client";
import { useSession } from "next-auth/react";
import styles from "./index.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import WordCard from "@/components/WordCard";
import clsx from "clsx";

type Data = {
  words: Array<Word>;
};

type Form = {
  word: string;
  meaning: string;
};

export default function SiteIndex() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<Form>({ mode: "onChange" });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const router = useRouter();
  const { data: session } = useSession();
  const sessionId = session?.user?.id;
  const { id: bookId } = router.query;

  const { data } = useSWR<Data>(
    bookId && `/api/word?bookId=${bookId}`,
    fetcher
  );

  const onSubmit: SubmitHandler<Form> = async (data, e) => {
    e?.preventDefault();
    setIsSubmiting(true);
    const res = await fetch(`/api/word`, {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionId,
        word: data.word,
        meaning: data.meaning,
        bookId,
      }),
    });
    if (res.ok) {
      reset();
      mutate(`/api/word?bookId=${bookId}`);
    }
    setIsSubmiting(false);
  };

  const onDelete = async (id: string) => {
    setIsLoading(true);
    await fetch(`/api/word?wordId=${id}`, {
      method: HttpMethod.DELETE,
      headers: {
        "Content-Type": "application/json",
      },
    });
    mutate(`/api/word?bookId=${bookId}`);
    setIsLoading(false);
  };

  return (
    <Layout>
      {data && !isLoading ? (
        <>
          <form
            onSubmit={(e) => {
              handleSubmit(onSubmit)(e);
            }}
            className={styles.form}
          >
            <div className="grid gap-y-5 ">
              <div className="border border-gray-700 ">
                <input
                  className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                  placeholder="単語"
                  type="text"
                  {...register("word", { required: true })}
                />
              </div>
              <div className="border border-gray-700">
                <input
                  className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                  placeholder="意味"
                  {...register("meaning", { required: true })}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmiting || !isValid}
              className={clsx(
                styles.submitButton,
                isSubmiting || !isValid ? "opacity-30" : "hover:opacity-70"
              )}
            >
              {isSubmiting ? <LoadingDots /> : "追加"}
            </button>
          </form>
          {data.words?.length > 0 && (
            <button
              type="button"
              onClick={() => router.push(`/book/${bookId}/question`)}
              className={clsx(styles.questionButton)}
            >
              出題
            </button>
          )}
          <div className={styles.wrapper}>
            {data.words?.length > 0 ? (
              data.words.map(
                (word, i) =>
                  word.word && (
                    <WordCard word={word} key={i} onDelete={onDelete} />
                  )
              )
            ) : (
              <div className="text-center">
                <p className="text-xl font-cal text-gray-600">
                  単語が存在しません
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </Layout>
  );
}
