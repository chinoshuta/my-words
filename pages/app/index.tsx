import { useState } from "react";
import Layout from "@/components/app/Layout";
import AddBookModal from "@/components/Modals/AddBookModal";

import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Book } from "@prisma/client";
import { CircularProgress } from "@mui/material";
import styles from "./index.module.scss";

const IndexPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: book } = useSWR<Array<Book>>(sessionId && "/api/book", fetcher);

  return (
    <Layout>
      {book ? (
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
                <Link href={`/book/${book.id}`} key={book.id}>
                  <a>
                    <div className={styles.book}>
                      <h2 className="font-cal text-3xl">{book.name}</h2>
                    </div>
                  </a>
                </Link>
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
