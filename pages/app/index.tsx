import { useState } from "react";
import Layout from "@/components/app/Layout";
import AddBookModal from "@/components/Modals/AddBookModal";

import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import type { Book } from "@prisma/client";
import LoadingDots from "@/components/app/loading-dots";
import { CircularProgress } from "@mui/material";

const IndexPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: session } = useSession();
  const sessionId = session?.user?.id;

  const { data: book } = useSWR<Array<Book>>(sessionId && `/api/book`, fetcher);

  return (
    <Layout>
      <AddBookModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 justify-between items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="ml-auto font-cal text-lg w-3/4 sm:w-40 tracking-wide text-white bg-black border-black border-2 px-5 py-3 hover:bg-white hover:text-black transition-all ease-in-out duration-150"
          >
            単語帳を追加
          </button>
        </div>
        <div className="my-10 grid gap-y-10">
          {book ? (
            book.length > 0 ? (
              book.map((book) => (
                <Link href={`/book/${book.id}`} key={book.id}>
                  <a>
                    <div className="flex flex-col md:flex-row md:h-30 rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative p-10">
                        <h2 className="font-cal text-3xl">{book.name}</h2>
                        <p className="text-base my-5 line-clamp-3">
                          {book.description}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                  <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300" />
                  <div className="relative p-10 grid gap-5">
                    <div className="w-28 h-10 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                    <div className="w-48 h-6 rounded-md bg-gray-300" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-cal text-gray-600">
                    単語帳が存在しません。新しく単語帳を作成しましょう！
                  </p>
                </div>
              </>
            )
          ) : (
            <CircularProgress />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
