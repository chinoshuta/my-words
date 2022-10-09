import Layout from "@/components/app/Layout";
import fetcher from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import { CircularProgress } from "@mui/material";
import { Word } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import styles from "./question.module.scss";

type Data = {
  words: Array<Word>;
};

const QuestionPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMeaning, setIsMeaning] = useState<boolean>(false);
  const router = useRouter();
  const { id: bookId } = router.query;
  const { data } = useSWR<Data>(
    bookId && `/api/word?bookId=${bookId}`,
    fetcher
  );

  const getCorrectRate = (word: Word) => {
    const rate = word.correct! / word.answers!;
    return rate ?? 0;
  };

  const words: Array<Word> = data?.words
    ? data.words.sort((a, b) => {
        if (getCorrectRate(a) > getCorrectRate(b)) return 1;
        return -1;
      })
    : [];

  const onNext = () => {
    setIsMeaning(false);
    setIndex((prev) => prev + 1);
  };

  const onCorrect = async () => {
    setIsLoading(true);
    await fetch(`/api/word`, {
      method: HttpMethod.PUT,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wordId: words[index].id,
        answers: words[index].answers ? words[index].answers! + 1 : 1,
        correct: words[index].correct ? words[index].correct! + 1 : 1,
      }),
    });
    setIsLoading(false);
    setIsMeaning(true);
  };

  const onMistake = async () => {
    setIsLoading(true);
    await fetch(`/api/word`, {
      method: HttpMethod.PUT,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wordId: words[index].id,
        answers: words[index].answers ? words[index].answers! + 1 : 1,
        correct: words[index].correct ?? 0,
      }),
    });
    setIsLoading(false);
    setIsMeaning(true);
  };

  return (
    <Layout>
      {data && !isLoading ? (
        <div className={styles.container}>
          <p className={styles.index}>
            {index + 1}/{words?.length}
          </p>
          {isMeaning ? (
            <>
              <p className={styles.word}>{words[index]?.meaning}</p>
              <div className={clsx(styles.buttonWrapper, "flex-col")}>
                {words?.length && index + 1 < words.length ? (
                  <div className={styles.button} onClick={onNext}>
                    次の単語へ
                  </div>
                ) : (
                  <div
                    className={styles.button}
                    onClick={() => location.reload()}
                  >
                    もう一度
                  </div>
                )}
                <div
                  className={styles.button}
                  onClick={() => router.push(`/book/${bookId}`)}
                >
                  単語帳に戻る
                </div>
              </div>
            </>
          ) : (
            <>
              <p className={styles.word}>{words[index]?.word}</p>
              <div className={styles.buttonWrapper}>
                <div className={styles.button} onClick={() => onCorrect()}>
                  わかった
                </div>
                <div className={styles.button} onClick={() => onMistake()}>
                  わからない
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <CircularProgress />
      )}
    </Layout>
  );
};

export default QuestionPage;
