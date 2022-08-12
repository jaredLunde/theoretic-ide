import * as React from "react";
import type { RequestPolicy, UseQueryState } from "urql";
import { useMeQuery } from "@/gql/users";
import type { MeQuery } from "@/gql/users";

/**
 * A special Urql hook that returns the viewer data from the viewer query.
 * All it currently does is shorten the path to the viewer data by eliminating
 * one property.
 *
 * @param root0 - Options
 * @param root0.requestPolicy - The request policy to use for the query
 */
export function useMe({
  requestPolicy,
}: { requestPolicy?: RequestPolicy } = {}) {
  const [me, refetch] = useMeQuery({
    // On the client-side we default to "cache-only" because we don't want to
    // fire off this query when the hook initially runs. We should have that
    // data already in the cache.
    requestPolicy:
      requestPolicy ?? typeof window !== "undefined"
        ? "cache-only"
        : "cache-first",
  });

  return [
    React.useMemo(
      () => ({
        ...me,
        data: me.data?.me,
      }),
      [me]
    ),
    refetch,
  ] as const;
}

export interface UseMeState
  extends Omit<UseQueryState<MeQuery, object>, "data"> {
  data: MeQuery["me"] | undefined;
}
