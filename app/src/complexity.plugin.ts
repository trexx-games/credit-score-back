import { Plugin } from "@nestjs/apollo"
import { GraphQLSchemaHost } from "@nestjs/graphql"
import { ApolloServerPlugin, GraphQLRequestListener } from "apollo-server-plugin-base"
import { GraphQLError } from "graphql"
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity"

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  public constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  public async requestDidStart(): Promise<GraphQLRequestListener> {
    const maxComplexity = 250
    const { schema } = this.gqlSchemaHost

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
        })

        if (complexity > maxComplexity) {
          throw new GraphQLError(`Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`)
        }
      },
    }
  }
}
