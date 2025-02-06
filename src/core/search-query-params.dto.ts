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
   * @example createdAt asc
   */
  sort?: string;

  /**
   * The search string to filter by.
   * @example John Doe
   */
  searchString?: string;

  /**
   * The fields to select.
   * @example ['name', 'email']
   */
  populate?: string[];

  /**
   * The fields to select.
   * @example *
   */
  select: string[] | string = '*';
}
