import { computed, reactive, ref, toRefs, watch } from '@nuxtjs/composition-api'
import { useClipboard } from '@vueuse/core'
import { useParseSql } from '~/composables/use-parse-sql'
import { useCreateErrorMessage } from '~/composables/use-create-error-message'
import { useCreateXmlString } from '~/composables/use-create-xml-string'
import { ConvertType } from '~/models/ConvertType'

interface ConvertOption {
  item: ConvertType
  name: string
}

export interface ConvertForm {
  sqlText: string
  convertType: ConvertType
  convertOptions: Array<ConvertOption>
}

export const useIndex = () => {
  const form = reactive<ConvertForm>({
    sqlText: '',
    convertType: 'none',
    convertOptions: [
      { item: 'none', name: 'none' },
      { item: 'upper', name: 'toUpper' },
      { item: 'lower', name: 'toLower' },
    ],
  })
  const errorMessage = ref('')
  const xmlText = ref('')
  const nodataState = computed(
    () => errorMessage.value === '' && xmlText.value === ''
  )
  const successState = computed(() => xmlText.value !== '')
  const errorState = computed(() => errorMessage.value !== '')

  const { parseSql } = useParseSql()
  const { createErrorMessage } = useCreateErrorMessage()
  const { createXmlString } = useCreateXmlString()
  const { copy } = useClipboard()

  // https://qiita.com/kubotak/items/94b1f809ee2511140cf3
  watch(
    () => form,
    () => {
      console.log(`sqlText=${form.sqlText}`)
      if (form.sqlText === '') {
        errorMessage.value = ''
        xmlText.value = ''
        return
      }
      convertSqlToXml()
    },
    { deep: true }
  )

  const convertSqlToXml = () => {
    const sqlLines = form.sqlText.split('\n')
    const xmlStrings: Array<string> = []
    let i = 1
    try {
      for (const sqlLine of sqlLines) {
        if (sqlLine === '') {
          i++
          continue
        }

        try {
          const parseResult = parseSql(sqlLine, form.convertType)
          const xmlString = createXmlString(parseResult)
          xmlStrings.push(xmlString)
        } catch (e) {
          throw new Error(createErrorMessage(i, e.message, sqlLine))
        }

        i++
      }

      errorMessage.value = ''
      xmlText.value = createResultXml(xmlStrings)
    } catch (e) {
      errorMessage.value = e.message
      xmlText.value = ''
    }
  }

  const createResultXml = (xmlLines: Array<string>) => {
    return xmlLines.join('\n')
  }

  const clearXmlText = () => {
    form.sqlText = ''
  }

  const copyXml = () => {
    copy(xmlText.value)
  }

  return {
    ...toRefs(form),
    errorMessage,
    xmlText,
    nodataState,
    successState,
    errorState,
    clearXmlText,
    copyXml,
  }
}
