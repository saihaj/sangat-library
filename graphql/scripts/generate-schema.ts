import { resolve } from 'path'
import { writeFileSync } from 'fs'
import { printSchema } from 'graphql'
import { schema } from '../src/schema'

writeFileSync(resolve(__dirname, '../schema.graphql'), printSchema(schema))
