import { DateTime } from "luxon"
import gql from "graphql-tag"

const clock = variables => Object.assign(variables, {
  created_at: DateTime.local().toUTC().toSQL(),
  updated_at: DateTime.local().toUTC().toSQL(),
})

const clock_fields = `
created_at: $created_at,
updated_at: $created_at`

const clock_variables = `
$created_at: timestamp!,
$updated_at: timestamp!
`

export const change_room_pricing = (graph, variables) => {
  graph.mutate({ mutation: gql`
    mutation (
      ${clock_variables},
      $pricing_factor: float8!,
    ) {
      insert_room_pricing_events(objects: {
        pricing_factor: $pricing_factor,
        ${clock_fields},
      }) { affected_rows }
    }
    `,
    variables: clock(variables)
  })
}

export const change_room_discount_day = (graph, variables) => {
  graph.mutate({ mutation: gql`
    mutation (
      ${clock_variables},
      $day_of_week: Int!,
    ) {
      insert_room_discount_day_events(objects: {
        day_of_week: $day_of_week,
        ${clock_fields},
      }) { affected_rows }
    }
    `,
    variables: clock(variables)
  })
}