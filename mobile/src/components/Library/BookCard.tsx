import React from 'react'
import {
  Box,
  Heading,
  AspectRatio,
  Image,
  Text,
  Stack,
  Pressable,
} from 'native-base'
import { useFragment, graphql } from 'react-relay'
import { BookCard$key } from 'relay-artifacts/BookCard.graphql'
import { useNavigation } from '@react-navigation/core'
import { Screens } from '../../lib/navigation'

type BookCardProps = {
  book: BookCard$key
}

const BookCard = ({ book }: BookCardProps) => {
  const navigation = useNavigation()
  const data = useFragment(
    graphql`
      fragment BookCard on Book {
        id
        title
        description
        author {
          name
        }
      }
    `,
    book,
  )

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(Screens.BookDetailScreen, { id: data.id })
      }
    >
      <Box
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
      >
        <Box>
          <AspectRatio ratio={16 / 9}>
            <Image
              source={{
                uri: 'https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg',
              }}
              alt="image"
            />
          </AspectRatio>
        </Box>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <Heading size="xl" ml="-1">
              {data.title}
            </Heading>
            <Text fontSize="md" fontWeight="500" ml="-0.5" mt="-2">
              {data.author.name}
            </Text>
          </Stack>
          {data.description && <Text fontWeight="400">{data.description}</Text>}
        </Stack>
      </Box>
    </Pressable>
  )
}

export default BookCard
