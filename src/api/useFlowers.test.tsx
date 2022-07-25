/* eslint-disable no-unused-vars */
import { useFlowers } from "./useFlowers";
import nock from "nock";
import { createWrapper } from "../utils";
import { cleanup } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";

const generateMockedResponse = (page: any, total_pages = 2) => {
  const currentPage = Number(page);
  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  return {
    data: [
      {
        id: currentPage,
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
        current_page: currentPage,
        prev_page: previousPage > 0 ? previousPage : null,
        next_page: nextPage <= total_pages ? nextPage : null,
        total_pages,
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

    // Works
    await waitFor(() => result.current.isSuccess);

    // Works
    expect(result.current.data?.pages).toStrictEqual([
      generateMockedResponse(1),
    ]);

    // Sweet.
    expect(result.current.hasNextPage).toBe(true);

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => result.current.data?.pages.length === 2);

    expect(result.current.data?.pages).toStrictEqual([
      generateMockedResponse(1),
      generateMockedResponse(2),
    ]);
  });
});
