import { User } from '.prisma/client'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay'
import {
  GraphQLDateTime,
  GraphQLEmailAddress,
  GraphQLPhoneNumber,
} from 'graphql-scalars'
import { GraphQLContext } from '../context'
import { NodeInterface } from '../node'
import { AddressType } from './address'
import { IssueConnection } from './issue'
import { LibraryConnection } from './library'
import { MetaNodeInterface, TypeNames } from './shared'
/**
 * ```graphql
 * type User implements Node & MetaNode {
 *   id: ID!
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 *   name: String!
 *   email: EmailAddress!
 *   phone: PhoneNumber!
 *   address: Address!
 *   booksIssued(after: String, first: Int, before: String, last: Int): IssueConnection
 *   managing(after: String, first: Int, before: String, last: Int): LibraryConnection
 * }
 * ```
 */
export const UserType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.User,
  interfaces: [NodeInterface, MetaNodeInterface],
  fields: () => ({
    id: globalIdField(),
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLEmailAddress) },
    phone: { type: GraphQLNonNull(GraphQLPhoneNumber) },
    address: {
      type: GraphQLNonNull(AddressType),
      resolve: (root: User) => {
        return {
          street: root.street,
          city: root.city,
          country: root.country,
          zip: root.zip,
          additional: root.additional,
        }
      },
    },
    booksIssued: {
      type: IssueConnection,
      args: connectionArgs,
      description: 'Books borrowed by user',
    },
    managing: {
      type: LibraryConnection,
      args: connectionArgs,
      description: 'Libraries managed by user',
      resolve: async (root: User, args, { prisma }) => {
        const managing = await prisma.user
          .findFirst({ where: { id: root.id } })
          .managing()

        return connectionFromArray(managing, args)
      },
    },
  }),
})

const { connectionType } = connectionDefinitions({ nodeType: UserType })

/**
 * ```graphql
 * type UserEdge {
 *   cursor: String!
 *   node: User
 * }
 *
 * type UserConnection {
 *   edges: [UserEdge]
 *   pageInfo: PageInfo!
 * }
 * ```
 */
export const UserConnection = connectionType
