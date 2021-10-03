import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { GraphQLContext } from './context'
import resolveType from './types/resolveType'

const { nodeInterface, nodeField } = nodeDefinitions<GraphQLContext>(
  async (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    return { id, type }
  },
  (obj) => resolveType(obj),
)
/**
 * ```graphql
 * interface Node {
 *   """
 *   The ID of an object
 *   """
 *   id: ID!
 * }
 * ```
 */
export const NodeInterface = nodeInterface

/**
 * Fetches an object given its ID
 */
export const NodeField = nodeField
