import { GraphQLInterfaceType, GraphQLNonNull } from 'graphql'
import { GraphQLDateTime } from 'graphql-scalars'

export enum TypeNames {
  Query = 'Query',
  Mutation = 'Mutation',
  Author = 'Author',
  User = 'User',
  Book = 'Book',
  Genre = 'Genre',
  Library = 'Library',
  Address = 'Address',
  Issue = 'Issue',
  BookAvailability = 'BookAvailability',
  MetaNode = 'MetaNode',
}

/**
 * ```graphql
 * interface MetaNode {
 *   createdAt: DateTime!
 *   updatedAt: DateTime!
 * }
 * ```
 */
export const MetaNodeInterface = new GraphQLInterfaceType({
  name: TypeNames.MetaNode,
  fields: () => ({
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
  }),
})
