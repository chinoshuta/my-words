import Layout from "@/components/app/Layout";
import { HttpMethod } from "@/types";
import { CircularProgress } from "@mui/material";
import { Word } from "@prisma/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./question.module.scss";

const QuestionPage = () => {
  const [index, setIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMeaning, setIsMeaning] = useState<boolean>(false);
  const [stateWords, setStateWords] = useState<Word[]>([]);
  const router = useRouter();
  const { id: bookId } = router.query;

  const getCorrectRate = (word: Word) => {
    const rate = word.correct! / word.answers!;
    return rate ?? 0;
  };

  const getSortWords = (words: Word[]): Word[] => {
    return words?.length
      ? words.slice().sort((a, b) => {
          if (getCorrectRate(a) > getCorrectRate(b)) return 1;
          return -1;
        })
      : [];
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/word?bookId=${bookId}`, {
      method: HttpMethod.GET,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setStateWords(getSortWords(data.words)))
      .finally(() => setIsLoading(false));
  }, [bookId]);

  // useEffect(() => {
  //   console.log(isMeaning ? "解答" : "単語");
  //   console.log(`番号${index + 1}`);
  //   console.log(words[index]);
  //   console.log(words);
  // }, [isMeaning]);

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
        wordId: stateWords[index].id,
        answers: stateWords[index].answers ? stateWords[index].answers! + 1 : 1,
        correct: stateWords[index].correct ? stateWords[index].correct! + 1 : 1,
      }),
    });
    setIsMeaning(true);
    setIsLoading(false);
  };

  const onMistake = async () => {
    setIsLoading(true);
    await fetch(`/api/word`, {
      method: HttpMethod.PUT,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wordId: stateWords[index].id,
        answers: stateWords[index].answers ? stateWords[index].answers! + 1 : 1,
        correct: stateWords[index].correct ?? 0,
      }),
    });
    setIsMeaning(true);
    setIsLoading(false);
  };

  return (
    <Layout>
      {!isLoading ? (
        <div className={styles.container}>
          <p className={styles.index}>
            {index + 1}/{stateWords?.length}
          </p>
          {isMeaning ? (
            <>
              <p className={styles.word}>{stateWords[index]?.meaning}</p>
              <div className={clsx(styles.buttonWrapper, "flex-col")}>
                {stateWords?.length && index + 1 < stateWords.length ? (
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
                  onClick={() => location.reload()}
                >
                  単語帳に戻る
                </div>
              </div>
            </>
          ) : (
            <>
              <p className={styles.word}>{stateWords[index]?.word}</p>
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
