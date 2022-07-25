/* eslint-disable no-unused-vars */
import { useFlowers } from "./useFlowers";
import nock from "nock";
import { createWrapper } from "../utils";
import { cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

const generateMockedResponse = (page: any) => {
  return {
    data: [
      {
        id: 7,
        name: "Alpski volcin",
        latin_name: "Daphne alpina",
        sightings: 19,
        profile_picture:
          "//flowrspot.s3.amazonaws.com/flowers/profile_pictures/000/000/007/medium/L_00010.jpg?1527514226",
        favorite: false,
      },
    ],
    meta: {
      pagination: {
        current_page: Number(page),
        prev_page: null,
        next_page: 2,
        total_pages: 4,
      },
    },
  };
};

describe("query hook", () => {
  beforeAll(() => {
    nock("https://flowrspot-api.herokuapp.com/api")
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .persist()
      .get("/v1/flowers")
      .query(true)
      .reply(200, (uri) => {
        const url = new URL(`https://flowrspot-api.herokuapp.com/api${uri}`);
        const { page } = Object.fromEntries(url.searchParams);

        return generateMockedResponse(page);
      });
  });

  afterEach(cleanup);

  test("successful query hook", async () => {
    const { result, waitFor } = renderHook(() => useFlowers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.pages).toStrictEqual([
      generateMockedResponse(1),
    ]);

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    await waitFor(() => expect(result.current.isFetching).toBe(true));

    expect(result.current.data?.pages).toStrictEqual([
      generateMockedResponse(1),
      generateMockedResponse(2),
    ]);
  });
});
