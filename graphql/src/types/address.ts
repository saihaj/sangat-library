import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLContext } from '../context'
import { TypeNames } from './shared'

/**
 * ```graphql
 * type Address {
 *   street: String!
 *   additional: String
 *   city: String!
 *   country: String!
 *   zip: String!
 * }
 * ```
 */
export const AddressType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Address,
  fields: () => ({
    street: {
      type: GraphQLNonNull(GraphQLString),
    },
    city: { type: GraphQLNonNull(GraphQLString) },
    country: { type: GraphQLNonNull(GraphQLString) },
    zip: { type: GraphQLNonNull(GraphQLString) },
    additional: { type: GraphQLString },
  }),
})
