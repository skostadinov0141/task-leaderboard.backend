export class SearchQueryParamsDto {
  /**
   * The page number to return.
   * @example 1
   */
  page: number = 1;

  /**
   * The number of items to return per page.
   * @example 20
   */
  limit: number = 20;

  /**
   * The field to sort by.
   * @example ''
   */
  sort?: string;

  /**
   * The search string to filter by.
   * @example ''
   */
  searchString?: string;

  /**
   * The fields to populate. (Comma-separated)
   * @example ''
   */
  populate?: string;

  /**
   * The fields to select. (Comma-separated)
   * @example ''
   */
  select?: string;
}
