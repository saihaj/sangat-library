import { Genre } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionDefinitions,
  globalIdField,
} from 'graphql-relay'
import { GraphQLDateTime } from 'graphql-scalars'
import { NodeInterface } from '../node'
import { GraphQLContext } from '../context'
import { BookConnection } from './book'
import { MetaNodeInterface, TypeNames } from './shared'

/**
 * ```graphql
 * type Genre implements Node & MetaNode {
 *   id: ID!
 *   name: String!
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 *   books(after: String, first: Int, before: String, last: Int): BookConnection
 * }
 * ```
 */
export const GenreType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Genre,
  interfaces: [NodeInterface, MetaNodeInterface],
  fields: () => ({
    id: globalIdField(),
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: BookConnection,
      args: connectionArgs,
      resolve: async (root: Genre, args, { prisma }) => {
        return await findManyCursorConnection(
          (args) =>
            prisma.genre.findFirst({ ...args, where: { id: root.id } }).books(),
          () => prisma.genre.count(),
          args,
        )
      },
    },
  }),
})

const { connectionType } = connectionDefinitions({ nodeType: GenreType })

/**
 * ```graphql
 * type GenreEdge {
 *   cursor: String!
 *   node: Genre
 * }
 *
 * type GenreConnection {
 *   edges: [GenreEdge]
 *   pageInfo: PageInfo!
 * }
 * ```
 */
export const GenreConnection = connectionType
