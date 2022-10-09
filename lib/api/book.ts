import prisma from "@/lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Book } from ".prisma/client";
import type { Session } from "next-auth";

/**
 * Get Book
 *
 * Fetches & returns either a single or all sites available depending on
 * whether a `siteId` query parameter is provided. If not all sites are
 * returned
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session - NextAuth.js session
 */
export async function getBook(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<Array<Book> | (Book | null)>> {
  const { bookId } = req.query;

  if (Array.isArray(bookId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    if (bookId) {
      const settings = await prisma.book.findFirst({
        where: {
          id: bookId,
          userId: session.user.id,
        },
      });

      return res.status(200).json(settings);
    }

    const books = await prisma.book.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Create Site
 *
 * Creates a new site from a set of provided query parameters.
 * These include:
 *  - name
 *  - description
 *  - subdomain
 *  - userId
 *
 * Once created, the sites new `siteId` will be returned.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function createBook(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{
  bookId: string;
}>> {
  const { name, description, userId } = req.body;

  try {
    const response = await prisma.book.create({
      data: {
        name: name,
        description: description,
        userId,
        isPublic: false,
      },
    });

    return res.status(201).json({
      bookId: response.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Delete Site
 *
 * Deletes a site from the database using a provided `siteId` query
 * parameter.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function deleteBook(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse> {
  const { bookId } = req.query;

  if (Array.isArray(bookId))
    return res
      .status(400)
      .end("Bad request. siteId parameter cannot be an array.");

  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: {
          site: {
            id: bookId,
          },
        },
      }),
      prisma.site.delete({
        where: {
          id: bookId,
        },
      }),
    ]);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

/**
 * Update site
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - currentSubdomain
 *  - name
 *  - description
 *  - image
 *  - imageBlurhash
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 */
export async function updateBook(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Book>> {
  const { id, name, description } = req.body;

  try {
    const response = await prisma.book.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
