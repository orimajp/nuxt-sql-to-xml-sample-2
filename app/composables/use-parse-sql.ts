import { ParseResult } from '~/models/ParseResult'
import { ConvertType } from '~/models/ConvertType'

export const useParseSql = () => {
  const parseSql = (sql: string, convertType: ConvertType): ParseResult => {
    const sqlArray = separateSql(sql)
    const tableName = getTableName(sqlArray[0], convertType)
    const pareArray = createColumnValuePareArray(
      sqlArray[1],
      sqlArray[3],
      convertType
    )

    return new ParseResult(tableName, pareArray)
  }

  const separateSql = (sql: string) => {
    const parts = sql.split(/[()]/)
    if (parts.length !== 5) {
      throw createParseError()
    }
    return parts
  }

  const getTableName = (partSql: string, convertType: ConvertType) => {
    const sqlWords = partSql.trim().split(' ')
    if (sqlWords.length !== 3) {
      throw createParseError()
    }
    return convertCase(sqlWords[2], convertType)
  }

  const createColumnValuePareArray = (
    columnWords: string,
    valueWords: string,
    convertType: ConvertType
  ) => {
    const columns = columnWords.split(',')
    const values = valueWords.split(',')
    if (
      columns.length === 0 ||
      values.length === 0 ||
      columns.length !== values.length
    ) {
      throw createParseError()
    }

    const pareArray: Array<[string, string]> = []
    for (let i = 0; i < columns.length; i++) {
      const column = convertCase(columns[i].trim(), convertType)
      const value = values[i].trim().replaceAll("'", '')
      pareArray.push([column, value])
    }

    return pareArray
  }

  const convertCase = (name: string, convertType: ConvertType) => {
    switch (convertType) {
      case 'lower':
        return name.toLowerCase()
      case 'upper':
        return name.toUpperCase()
      case 'none':
        return name
      default:
        // 型定義的には来ないはず
        throw new Error(`不正な変換タイプ type=${convertType}`)
    }
  }

  const createParseError = () => {
    return new Error('parse error')
  }

  return {
    parseSql,
  }
}
