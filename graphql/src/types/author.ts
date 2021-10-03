import { Author } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionDefinitions,
  globalIdField,
} from 'graphql-relay'
import { GraphQLDateTime } from 'graphql-scalars'
import { BookConnection } from './book'
import { GraphQLContext } from '../context'
import { NodeInterface } from '../node'
import { MetaNodeInterface, TypeNames } from './shared'
import { LibraryType } from './library'

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
        return await findManyCursorConnection(
          (args) =>
            prisma.author
              .findFirst({ ...args, where: { id: root.id } })
              .books(),
          () => prisma.genre.count(),
          args,
        )
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
