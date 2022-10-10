import { useState } from "react";
import Layout from "@/components/app/Layout";
import AddBookModal from "@/components/Modals/AddBookModal";

import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR, { mutate, useSWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Book } from "@prisma/client";
import { CircularProgress } from "@mui/material";
import styles from "./index.module.scss";
import { HttpMethod } from "@/types";

const IndexPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: book } = useSWR<Array<Book>>(sessionId && "/api/book", fetcher);

  const onDelete = async (id: string) => {
    let isOk = window.confirm("本当に削除しますか？");
    if (isOk) {
      setIsLoading(true);
      await fetch(`/api/book?bookId=${id}`, {
        method: HttpMethod.DELETE,
        headers: {
          "Content-Type": "application/json",
        },
      });
      mutate(`/api/book`);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {book && !isLoading ? (
        <>
          <AddBookModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
          <div className={styles.buttonWrapper}>
            <button onClick={() => setIsOpen(true)} className={styles.button}>
              単語帳を追加
            </button>
          </div>
          <div className="my-10 grid gap-y-10">
            {book?.length > 0 ? (
              book.map((book) => (
                <div key={book.id} className={styles.bookWrapper}>
                  <Link href={`/book/${book.id}`}>
                    <div className={styles.book}>
                      <h2 className="font-cal text-3xl">{book.name}</h2>
                    </div>
                  </Link>
                  <div
                    className={styles.delete}
                    onClick={() => onDelete(book.id)}
                  >
                    ✖️
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <p className="text-xl font-cal text-gray-600">
                    単語帳が存在しません。新しく単語帳を作成しましょう！
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </Layout>
  );
};

export default IndexPage;
