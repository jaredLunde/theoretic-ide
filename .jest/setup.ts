import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { matchers } from "@dash-ui/jest";

/**
 * Adds matchers for toHaveStyleRule from @dash-ui/jest
 * @see https://github.com/dash-ui/jest
 */
expect.extend(matchers);

afterEach(() => {
  // Clears all mocks after each test
  jest.clearAllMocks();
  // Clears local storage after each test
  typeof localStorage !== "undefined" && localStorage.clear();
});

beforeAll(() => {
  // Instructs Jest to use fake versions of the standard timer functions.
  jest.useFakeTimers();
});
