import React, { Suspense } from 'react'
import { Spinner } from 'native-base'
import { graphql, usePreloadedQuery, PreloadedQuery } from 'react-relay'
import { useNavigation } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { LibraryQuery } from 'relay-artifacts/LibraryQuery.graphql'
import { NavigationParams, Screens } from '../../lib/navigation'
import Books from './Books'

type LibraryProps = {
  initialQuery: PreloadedQuery<LibraryQuery>
}

type Navigation = NativeStackNavigationProp<
  NavigationParams,
  Screens.BookDetailScreen
>

const Library = ({ initialQuery }: LibraryProps) => {
  const navigation = useNavigation<Navigation>()
  const data = usePreloadedQuery<LibraryQuery>(
    graphql`
      query LibraryQuery($libraryId: ID!) {
        library(id: $libraryId) {
          name
          ...BooksQuery
        }
      }
    `,
    initialQuery,
  )

  navigation.setOptions({ headerTitle: data.library.name })

  return (
    <Suspense fallback={<Spinner />}>
      <Books books={data.library} />
    </Suspense>
  )
}

export default Library
