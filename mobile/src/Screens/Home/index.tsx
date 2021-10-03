import React from 'react'
import { Flex } from 'native-base'
import { loadQuery, useRelayEnvironment } from 'react-relay'
import LibQuery, {
  LibraryQuery,
} from '../../relay-artifacts/LibraryQuery.graphql'
import Library from '../../components/Library'

const HomeScreen = () => {
  const env = useRelayEnvironment()
  const queryReference = loadQuery<LibraryQuery>(env, LibQuery, {
    libraryId: 'TGlicmFyeTpja3UyNDNhcWIwMDM3MTI5eDNweTZoaXBq',
  })

  return (
    <Flex px="4">
      <Library initialQuery={queryReference} />
    </Flex>
  )
}

export default HomeScreen
