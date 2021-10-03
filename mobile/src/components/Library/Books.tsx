import React from 'react'
import { Box, FlatList } from 'native-base'
import { graphql, usePaginationFragment } from 'react-relay'
import { BooksQuery$key } from 'relay-artifacts/BooksQuery.graphql'
import { BooksPaginationQuery } from 'relay-artifacts/BooksPaginationQuery.graphql'
import BookCard from './BookCard'

type BooksProps = {
  books: BooksQuery$key
}

const Books = ({ books }: BooksProps) => {
  const { data, isLoadingNext, refetch } = usePaginationFragment<
    BooksPaginationQuery,
    _
  >(
    graphql`
      fragment BooksQuery on Library
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 3 }
        cursor: { type: "String" }
      )
      @refetchable(queryName: "BooksPaginationQuery") {
        books(first: $count, after: $cursor)
          @connection(key: "BooksQuery_books") {
          edges {
            node {
              id
              ...BookCard
            }
          }
        }
      }
    `,
    books,
  )

  return (
    <Box safeAreaBottom={6}>
      <FlatList
        data={data?.books?.edges ?? []}
        renderItem={({ item }) => <BookCard book={item.node} />}
        keyExtractor={(item) => item.node.id}
        refreshing={isLoadingNext}
        progressViewOffset={0}
        onRefresh={() => refetch({}, { fetchPolicy: 'network-only' })}
        // TODO: fetch more when the user scrolls to the bottom
        // onEndReachedThreshold={2}
        // onEndReached={() => {
        //   if (hasNext && !isLoadingNext) {
        //     loadNext(10)
        //   }
        // }}
      />
    </Box>
  )
}

export default Books
