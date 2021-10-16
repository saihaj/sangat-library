import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { rootResolvers as BookRootResolvers } from './types/book'
import { rootResolvers as LibraryRootResolvers } from './types/library'
import { rootResolvers as GenreRootResolvers } from './types/genre'
import { rootResolvers as AuthorRootResolvers } from './types/author'
import { TypeNames } from './types/shared'
import { NodeField } from './node'
import { GraphQLContext } from './context'

/**
 * ```graphql
 * type Query {
 *   books(after: String, first: Int, before: String, last: Int): BookConnection
 *   book(id: ID!): Book
 *   authors(after: String, first: Int, before: String, last: Int): AuthorConnection
 *   author(id: ID!): Author
 *   libraries(after: String, first: Int, before: String, last: Int): LibraryConnection
 *   library(id: ID!): Library
 *   genres(after: String, first: Int, before: String, last: Int): GenreConnection
 *   genre(id: ID!): Genre
 * }
 * ```
 */
const QueryType = new GraphQLObjectType<any, GraphQLContext>({
  name: TypeNames.Query,
  fields: () => ({
    ...BookRootResolvers,
    ...AuthorRootResolvers,
    ...LibraryRootResolvers,
    ...GenreRootResolvers,
    node: NodeField,
  }),
})

export const schema = new GraphQLSchema({ query: QueryType })
