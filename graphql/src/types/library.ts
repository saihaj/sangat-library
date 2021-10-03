import { Library } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionDefinitions,
  globalIdField,
} from 'graphql-relay'
import {
  GraphQLDateTime,
  GraphQLEmailAddress,
  GraphQLPhoneNumber,
} from 'graphql-scalars'
import { NodeInterface } from '../node'
import { GraphQLContext } from '../context'
import { AddressType } from './address'
import { BookConnection } from './book'
import { UserConnection } from './user'
import { IssueConnection } from './issue'
import { MetaNodeInterface, TypeNames } from './shared'

/**
 * ```graphql
 * type Library implements Node & MetaNode {
 *   id: ID!
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 *   name: String!
 *   address: Address!
 *   phone: PhoneNumber!
 *   email: EmailAddress!
 *   management(after: String, first: Int, before: String, last: Int): UserConnection
 *   books(after: String, first: Int, before: String, last: Int): BookConnection
 *   borrowers(after: String, first: Int, before: String, last: Int): IssueConnection
 * }
 * ```
 */
export const LibraryType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Library,
  interfaces: [NodeInterface, MetaNodeInterface],
  fields: () => ({
    id: globalIdField(),
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    name: { type: GraphQLNonNull(GraphQLString) },
    address: {
      type: GraphQLNonNull(AddressType),
      resolve: (root: Library) => {
        return {
          street: root.street,
          city: root.city,
          country: root.country,
          zip: root.zip,
          additional: root.additional,
        }
      },
    },
    phone: { type: GraphQLNonNull(GraphQLPhoneNumber) },
    email: { type: GraphQLNonNull(GraphQLEmailAddress) },
    management: {
      type: UserConnection,
      args: connectionArgs,
      description: 'People managing the library',
      resolve: async (root: Library, args, { prisma }) => {
        return await findManyCursorConnection(
          (args) =>
            prisma.library
              .findFirst({ ...args, where: { id: root.id } })
              .management(),
          () => prisma.user.count(),
          args,
        )
      },
    },
    books: {
      type: BookConnection,
      args: connectionArgs,
      description: 'All available books in library',
      resolve: async (root: Library, args, { prisma }) => {
        return await findManyCursorConnection(
          (args) =>
            prisma.library
              .findFirst({ ...args, where: { id: root.id } })
              .books(),
          () => prisma.book.count(),
          args,
        )
      },
    },
    borrowers: {
      type: IssueConnection,
      args: connectionArgs,
      description: 'Issued books',
      resolve: async (root: Library, args, { prisma }) => {
        return await findManyCursorConnection(
          (args) =>
            prisma.library
              .findFirst({ ...args, where: { id: root.id } })
              .borrowers(),
          () => prisma.issue.count(),
          args,
        )
      },
    },
  }),
})

const { connectionType } = connectionDefinitions({ nodeType: LibraryType })

/**
 * ```graphql
 * type LibraryEdge {
 *   cursor: String!
 *   node: Library
 * }
 *
 * type LibraryConnection {
 *   edges: [LibraryEdge]
 *   pageInfo: PageInfo!
 * }
 * ```
 */
export const LibraryConnection = connectionType
