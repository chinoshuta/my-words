import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import useSWR from "swr";

import BlurImage from "@/components/BlurImage";
import Layout from "@/components/app/Layout";
import LoadingDots from "@/components/app/loading-dots";
import { fetcher } from "@/lib/fetcher";
import { HttpMethod } from "@/types";

import type { Word } from "@prisma/client";
import Modal from "@/components/Modal";
import { useSession } from "next-auth/react";

interface WordData {
  words: Array<Word>;
}

export default function SiteIndex() {
  const [creatingPost, setCreatingPost] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const siteWordRef = useRef<HTMLInputElement | null>(null);
  const siteMeaningRef = useRef<HTMLTextAreaElement | null>(null);

  const router = useRouter();
  const { data: session } = useSession();
  const sessionId = session?.user?.id;
  const { id: bookId } = router.query;

  const { data } = useSWR<WordData>(
    bookId && `/api/word?bookId=${bookId}`,
    fetcher
  );

  async function createWord(e: FormEvent<HTMLFormElement>) {
    try {
      const res = await fetch(`/api/word`, {
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: sessionId,
          word: siteWordRef.current?.value,
          meaning: siteMeaningRef.current?.value,
          bookId,
        }),
      });

      if (res.ok) {
        setCreatingPost(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Layout>
      <Modal showModal={isOpen} setShowModal={setIsOpen}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setCreatingPost(true);
            createWord(event);
          }}
          className="inline-block w-full max-w-md pt-8 overflow-hidden text-center align-middle transition-all bg-white shadow-xl rounded-lg"
        >
          <h2 className="font-cal text-2xl mb-6">単語を追加</h2>
          <div className="grid gap-y-5 w-5/6 mx-auto">
            <div className="border border-gray-700 rounded-lg flex flex-start items-center">
              <input
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                name="name"
                required
                placeholder="名前"
                ref={siteWordRef}
                type="text"
              />
            </div>
            <div className="border border-gray-700 rounded-lg flex flex-start items-top">
              <textarea
                className="w-full px-5 py-3 text-gray-700 bg-white border-none focus:outline-none focus:ring-0 rounded-none rounded-r-lg placeholder-gray-400"
                name="description"
                placeholder="説明"
                ref={siteMeaningRef}
                required
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-10 w-full">
            <button
              type="button"
              className="w-full px-5 py-5 text-sm text-gray-600 hover:text-black border-t border-gray-300 rounded-bl focus:outline-none focus:ring-0 transition-all ease-in-out duration-150"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              キャンセル
            </button>

            <button
              type="submit"
              disabled={creatingPost}
              className={`${
                creatingPost
                  ? "cursor-not-allowed text-gray-400 bg-gray-50"
                  : "bg-white text-gray-600 hover:text-black"
              } w-full px-5 py-5 text-sm border-t border-l border-gray-300 rounded-br focus:outline-none focus:ring-0 transition-all ease-in-out duration-150`}
            >
              {creatingPost ? <LoadingDots /> : "追加"}
            </button>
          </div>
        </form>
      </Modal>
      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 justify-between items-center">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className={`${
              creatingPost
                ? "cursor-not-allowed bg-gray-300 border-gray-300"
                : "text-white bg-black hover:bg-white hover:text-black border-black"
            } font-cal text-lg w-3/4 sm:w-40 tracking-wide border-2 px-5 py-3 transition-all ease-in-out duration-150`}
          >
            単語を追加
          </button>
        </div>
        <div className="my-10 grid gap-y-10">
          {data ? (
            data.words?.length > 0 ? (
              data.words.map((word) => (
                <Link href="" key={word.id}>
                  <a>
                    <div className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative p-10">
                        <h2 className="font-cal text-3xl">{word.word}</h2>
                        <p className="text-base my-5 line-clamp-3">
                          {word.meaning}
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
                    No posts yet. Click &quot;New Post&quot; to create one.
                  </p>
                </div>
              </>
            )
          ) : (
            [0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
                <div className="relative p-10 grid gap-5">
                  <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
