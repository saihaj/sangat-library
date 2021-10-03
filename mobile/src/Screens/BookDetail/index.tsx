import React from 'react'
import { Flex, Heading, Text } from 'native-base'
import { useLazyLoadQuery, graphql } from 'react-relay'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BookDetailScreenQuery } from 'relay-artifacts/BookDetailScreenQuery.graphql'
import { NavigationParams, Screens } from '../../lib/navigation'

type Route = RouteProp<NavigationParams, Screens.BookDetailScreen>
type Navigation = NativeStackNavigationProp<
  NavigationParams,
  Screens.BookDetailScreen
>

const BookDetailScreen = () => {
  const route = useRoute<Route>()
  const navigation = useNavigation<Navigation>()
  const data = useLazyLoadQuery<BookDetailScreenQuery>(
    graphql`
      query BookDetailScreenQuery($id: ID!) {
        book(id: $id) {
          title
          description
          author {
            name
          }
          identifier
        }
      }
    `,
    { id: route.params.id },
  )

  navigation.setOptions({ headerTitle: data.book.title })

  return (
    <Flex px="4" marginTop="1/3" alignItems="center">
      <Heading size="md">{data.book.author.name}</Heading>
      {data.book.description && <Text>{data.book.description}</Text>}
      <Text>{data.book.identifier}</Text>
    </Flex>
  )
}

export default BookDetailScreen
