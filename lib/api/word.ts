import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Word } from ".prisma/client";
import type { Session } from "next-auth";

export async function getWord(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Array<Word>>> {
  const { bookId } = req.query;

  try {
    const words = await prisma.word.findMany({
      where: {
        bookId: bookId as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      words,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

export async function createWord(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  wordId: string;
}>> {
  const { bookId, word, meaning, userId } = req.body;
  if (
    Array.isArray(bookId) ||
    Array.isArray(word) ||
    Array.isArray(meaning) ||
    Array.isArray(userId)
  )
    return res
      .status(400)
      .end("Bad request. postId parameter cannot be an array.");

  try {
    const response = await prisma.word.create({
      data: {
        word,
        meaning,
        answers: 0,
        correct: 0,
        bookId,
        userId,
      },
    });

    return res.status(201).json({
      wordId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

export async function deleteWord(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { wordId } = req.query;

  if (Array.isArray(wordId))
    return res
      .status(400)
      .end("Bad request. postId parameter cannot be an array.");

  try {
    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });
    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

export async function updateWord(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Word>> {
  const { word, meaning, wordId } = req.body;
  try {
    const post = await prisma.word.update({
      where: {
        id: wordId,
      },
      data: {
        word,
        meaning,
      },
    });
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
