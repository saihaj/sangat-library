import { Author } from '@prisma/client'
import {
  GraphQLFieldConfigMap,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
} from 'graphql-relay'
import { GraphQLDateTime } from 'graphql-scalars'
import { GraphQLContext } from '../context'
import { NodeInterface } from '../node'
import { LibraryType } from './library'
import { BookConnection } from './book'
import { MetaNodeInterface, TypeNames } from './shared'

/**
 * ```graphql
 * type Author implements Node & MetaNode {
 *   id: ID!
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 *   name: String!
 *   library: Library!
 *   books(after: String, first: Int, before: String, last: Int): BookConnection
 * }
 * ```
 */
export const AuthorType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Author,
  interfaces: [NodeInterface, MetaNodeInterface],
  fields: () => ({
    id: globalIdField(),
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    name: { type: GraphQLNonNull(GraphQLString) },
    library: {
      type: LibraryType,
      description: 'Library author belongs to',
      resolve: async (author: Author, _, { prisma }) => {
        return await prisma.author
          .findUnique({ where: { id: author.id } })
          .library()
      },
    },
    books: {
      type: BookConnection,
      args: connectionArgs,
      description: 'All books by author',
      resolve: async (root: Author, args, { prisma }) => {
        const books = await prisma.author
          .findFirst({ where: { id: root.id } })
          .books()

        return connectionFromArray(books, args)
      },
    },
  }),
})

const { connectionType } = connectionDefinitions({ nodeType: AuthorType })

/**
 * ```graphql
 * type AuthorEdge {
 *   cursor: String!
 *   node: Author
 * }
 *
 * type AuthorConnection {
 *   edges: [AuthorEdge]
 *   pageInfo: PageInfo!
 * }
 * ```
 */
export const AuthorConnection = connectionType

/**
 * ```graphql
 * authors(after: String, first: Int, before: String, last: Int): AuthorConnection
 * author(id: ID!): Author
 * ```
 */
export const rootResolvers: GraphQLFieldConfigMap<void, GraphQLContext> = {
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
}
