import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
} from 'graphql-relay'
import { BookConnection, BookType } from './types/book'
import { TypeNames } from './types/shared'
import { LibraryConnection, LibraryType } from './types/library'
import { GenreConnection, GenreType } from './types/genre'
import { AuthorConnection, AuthorType } from './types/author'
import { NodeField } from './node'
import { GraphQLContext } from './context'

/**
 * ```graphql
 * type Query {
 *   books(after: String, first: Int, before: String, last: Int): BookConnection
 *   book(id: ID!): Book
 *   authors(after: String, first: Int, before: String, last: Int): AuthorConnection
 *   author(id: ID!): Author
 *   libraries(after: String, first: Int, before: String, last: Int): LibraryConnection
 *   library(id: ID!): Library
 *   genres(after: String, first: Int, before: String, last: Int): GenreConnection
 *   genre(id: ID!): Genre
 * }
 * ```
 */
const QueryType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Query,
  fields: () => ({
    books: {
      type: BookConnection,
      args: connectionArgs,
      resolve: async (_, args, { prisma }) => {
        const books = await prisma.book.findMany()
        return connectionFromArray(books, args)
      },
    },
    book: {
      type: BookType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, { prisma }) => {
        const { id: bookId } = fromGlobalId(id)
        return await prisma.book.findFirst({ where: { id: bookId } })
      },
    },
    authors: {
      type: AuthorConnection,
      args: connectionArgs,
      resolve: async (_, args, { prisma }) => {
        const authors = await prisma.author.findMany()
        return connectionFromArray(authors, args)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, { prisma }) => {
        const { id: authorId } = fromGlobalId(id)
        return await prisma.author.findFirst({ where: { id: authorId } })
      },
    },
    libraries: {
      type: LibraryConnection,
      args: connectionArgs,
      resolve: async (_, args, { prisma }) => {
        const libraries = await prisma.library.findMany()
        return connectionFromArray(libraries, args)
      },
    },
    library: {
      type: LibraryType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, { prisma }) => {
        const { id: libraryId } = fromGlobalId(id)
        return await prisma.library.findFirst({ where: { id: libraryId } })
      },
    },
    genres: {
      type: GenreConnection,
      args: connectionArgs,
      resolve: async (_, args, { prisma }) => {
        const genres = await prisma.genre.findMany()
        return connectionFromArray(genres, args)
      },
    },
    genre: {
      type: GenreType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }, { prisma }) => {
        const { id: genreId } = fromGlobalId(id)
        return await prisma.genre.findFirst({ where: { id: genreId } })
      },
    },
    node: NodeField,
  }),
})

export const schema = new GraphQLSchema({ query: QueryType })
