import { Book } from '@prisma/client'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay'
import { GraphQLDateTime } from 'graphql-scalars'
import { NodeInterface } from '../node'
import { GraphQLContext } from '../context'
import { AuthorType } from './author'
import { GenreConnection } from './genre'
import { LibraryType } from './library'
import { MetaNodeInterface, TypeNames } from './shared'
/**
 * ```graphql
 * type Book implements Node & MetaNode {
 *   id: ID!
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 *   title: String!
 *   description: String
 *   isbn: String
 *   identifier: String
 *   author: Author!
 *   location: Library!
 *   genres(after: String, first: Int, before: String, last: Int): GenreConnection
 * }
 * ```
 */
export const BookType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Book,
  interfaces: [NodeInterface, MetaNodeInterface],
  fields: () => ({
    id: globalIdField(),
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    isbn: { type: GraphQLString },
    identifier: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: GraphQLNonNull(AuthorType),
      resolve: async (root: Book, _, { prisma }) => {
        return await prisma.book.findFirst({ where: { id: root.id } }).author()
      },
    },
    genres: {
      type: GenreConnection,
      args: connectionArgs,
      resolve: async (root: Book, args, { prisma }) => {
        const genres = await prisma.book
          .findUnique({ where: { id: root.id } })
          .genre()

        return connectionFromArray(genres, args)
      },
    },
    location: {
      type: LibraryType,
      description:
        'Current location of book is available in. Use author location to get original location where book belonged to.',
      resolve: async (root: Book, _, { prisma }) => {
        return await prisma.book
          .findFirst({ where: { id: root.id } })
          .location()
      },
    },
  }),
})

const { connectionType } = connectionDefinitions({ nodeType: BookType })

/**
 * ```graphql
 * type BookEdge {
 *   cursor: String!
 *   node: Book
 * }
 *
 * type BookConnection {
 *   edges: [BookEdge]
 *   pageInfo: PageInfo!
 * }
 * ```
 */
export const BookConnection = connectionType
