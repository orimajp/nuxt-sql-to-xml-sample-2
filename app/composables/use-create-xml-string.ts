import { ParseResult } from '~/models/ParseResult'

export const useCreateXmlString = () => {
  const createXmlString = (parseResult: ParseResult) => {
    const columnPareArray = parseResult.columnPareArray
    const partStringArray: Array<string> = []

    columnPareArray.forEach((columnPart) => {
      const part = createPartString(columnPart[0], columnPart[1])
      partStringArray.push(part)
    })

    const partString = partStringArray.join(' ')
    return createElement(parseResult.tableName, partString)
  }

  const createPartString = (key: string, value: string) => {
    return `${key}="${value}"`
  }

  const createElement = (tagName: string, part: string) => {
    return `<${tagName} ${part} />`
  }

  return {
    createXmlString,
  }
}
