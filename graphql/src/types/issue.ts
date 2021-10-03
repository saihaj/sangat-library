import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { connectionDefinitions, globalIdField } from 'graphql-relay'
import { GraphQLDateTime } from 'graphql-scalars'
import { Issue } from '@prisma/client'
import { NodeInterface } from '../node'
import { GraphQLContext } from '../context'
import { BookType } from './book'
import { UserType } from './user'
import { LibraryType } from './library'
import { MetaNodeInterface, TypeNames } from './shared'

/**
 * ```graphql
 * type Issue implements Node & MetaNode {
 *   id: ID!
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 *   dueDate: DateTime!
 *   book: Book!
 *   borrower: User!
 *   location: Library!
 * }
 * ```
 */
export const IssueType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Issue,
  interfaces: [NodeInterface, MetaNodeInterface],
  fields: () => ({
    id: globalIdField(),
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    dueDate: { type: GraphQLNonNull(GraphQLDateTime) },
    book: {
      type: GraphQLNonNull(BookType),
      resolve: async (root: Issue, _, { prisma }) => {
        return await prisma.issue.findUnique({ where: { id: root.id } }).book()
      },
    },
    borrower: {
      type: GraphQLNonNull(UserType),
      resolve: async (root: Issue, _, { prisma }) => {
        return await prisma.issue
          .findUnique({ where: { id: root.id } })
          .borrower()
      },
    },
    location: {
      type: GraphQLNonNull(LibraryType),
      resolve: async (root: Issue, _, { prisma }) => {
        return await prisma.issue
          .findUnique({ where: { id: root.id } })
          .location()
      },
    },
  }),
})

const { connectionType } = connectionDefinitions({ nodeType: IssueType })

/**
 * ```graphql
 * type IssueEdge {
 *   cursor: String!
 *   node: Issue
 * }
 *
 * type IssueConnection {
 *   edges: [IssueEdge]
 *   pageInfo: PageInfo!
 * }
 * ```
 */
export const IssueConnection = connectionType
