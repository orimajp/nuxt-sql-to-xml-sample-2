export class ParseResult {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly tableName: string,
    public readonly columnPareArray: Array<[string, string]>
  ) {}
}
