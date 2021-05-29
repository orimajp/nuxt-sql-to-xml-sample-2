<template>
  <b-container>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand href="#">SQL to XML</b-navbar-brand>
    </b-navbar>
    <div class="mt-4">
      <div class="mb-5">
        <div class="text-right mb-2">
          <b-button variant="info" size="lg" @click="clearXmlText"
            >SQL Clear</b-button
          >
        </div>
        <b-form-textarea
          ref="sqlTextAreaRef"
          v-model="sqlText"
          placeholder="INSERT INTO USER (ID,USERNAME) values (1, 'mine');..."
          rows="8"
          no-resize
        ></b-form-textarea>
        <b-form-radio-group
          v-model="convertType"
          :options="convertOptions"
          value-field="item"
          text-field="name"
          class="pl-1 pt-1"
        ></b-form-radio-group>
      </div>
      <div>
        <b-alert :show="errorState" variant="danger">
          <h4>Error!</h4>
          <p>{{ errorMessage }}</p>
        </b-alert>
        <b-form-textarea
          v-if="!errorState"
          v-model="xmlText"
          placeholder='<USER ID="1" USERNAME="mine" />...'
          rows="8"
          no-resize
          readonly
        ></b-form-textarea>
        <div class="text-right mt-2">
          <b-button
            v-if="!errorState"
            variant="outline-secondary"
            size="lg"
            @click="copyXml"
            >XML Copy</b-button
          >
        </div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useIndex } from '~/composables/use-index'

export default defineComponent({
  setup() {
    const {
      sqlText,
      convertType,
      convertOptions,
      errorMessage,
      xmlText,
      nodataState,
      successState,
      errorState,
      sqlTextAreaRef,
      clearXmlText,
      copyXml,
    } = useIndex()
    return {
      sqlText,
      convertType,
      convertOptions,
      errorMessage,
      xmlText,
      nodataState,
      successState,
      errorState,
      sqlTextAreaRef,
      clearXmlText,
      copyXml,
    }
  },
})
</script>

<style></style>
