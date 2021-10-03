import { CreateApp } from '@graphql-ez/vercel'
import { ezGraphiQLIDE } from '@graphql-ez/plugin-graphiql'
import { PrismaClient } from '@prisma/client'
import { useTiming } from '@envelop/core'
import { schema } from './schema'

const prisma = new PrismaClient()

export const ezApp = CreateApp({
  schema,
  buildContext: () => {
    return {
      prisma,
    }
  },
  ez: {
    plugins: [ezGraphiQLIDE()],
  },
  envelop: {
    plugins: [
      useTiming({
        onParsingMeasurement: () => null,
        onValidationMeasurement: () => null,
        onContextBuildingMeasurement: () => null,
        onResolverMeasurement: () => null,
        onSubscriptionMeasurement: () => null,
        onExecutionMeasurement: ({ contextValue }, timing) => {
          console.log(
            `Query \n${contextValue.req.body.query}\nVariables ${JSON.stringify(
              contextValue.req.body.variables,
            )}\nexecution in ${timing.ms}`,
          )
        },
      }),
    ],
  },
})
