export const useCreateErrorMessage = () => {
  const createErrorMessage = (
    lineNumber: number,
    message: string,
    sql: string
  ): string => {
    return `${message}: line ${lineNumber} => ${sql}`
  }

  return {
    createErrorMessage,
  }
}
