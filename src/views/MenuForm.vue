<template>
  <page
    :title="$t('menus:menuForm')"
    :is-content-loading="isInitialLoading"
    :footer="{
      onSubmit: submitForm,
      isSubmitting: isSubmitting,
    }"
  >
    <form novalidate @submit.prevent>
      <form-field
        v-model="values.alias"
        name="alias"
        :label="$t('menus:alias')"
        :error="errors.alias"
      />
      <form-field
        v-model="values.label"
        name="label"
        :label="$t('menus:label')"
        :error="errors.label"
      />
    </form>
  </page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { convertRequestErrorToMap } from '@tager/admin-services';

import {
  createMenu,
  getMenu,
  MenuUpdatePayload,
  updateMenu,
} from '../services/requests';
import { getMenuListUrl } from '../utils/paths';
import { MenuType } from '../typings/model';

type FormValues = MenuUpdatePayload;

export default defineComponent({
  name: 'MenuForm',
  data(): {
    values: FormValues;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isInitialLoading: boolean;
    menuListRoutePath: string;
  } {
    return {
      values: { label: '', alias: '' },
      errors: {},
      isSubmitting: false,
      isInitialLoading: false,
      menuListRoutePath: getMenuListUrl(),
    };
  },
  computed: {
    menuId(): string {
      return this.$route.params.menuId;
    },
    isCreation(): boolean {
      return this.menuId === 'create';
    },
  },
  mounted(): void {
    if (this.isCreation) return;

    this.isInitialLoading = true;

    getMenu(this.menuId)
      .then((response) => {
        this.values = this.convertMenuToFormValues(response.data);
      })
      .catch(console.error)
      .finally(() => {
        this.isInitialLoading = false;
      });
  },
  methods: {
    convertMenuToFormValues(menu: MenuType): FormValues {
      return {
        label: menu.label,
        alias: menu.alias,
      };
    },
    submitForm({ shouldExit }: { shouldExit: boolean }) {
      this.isSubmitting = true;

      const requestPromise = this.isCreation
        ? createMenu(this.values)
        : updateMenu(this.menuId, this.values);

      requestPromise
        .then(() => {
          this.errors = {};

          if (shouldExit) {
            this.$router.push(getMenuListUrl());
          }

          this.$toast({
            variant: 'success',
            title: 'Success',
            body: 'Menu have been successfully updated',
          });
        })
        .catch((error) => {
          console.error(error);
          this.errors = convertRequestErrorToMap(error);
          this.$toast({
            variant: 'danger',
            title: 'Error',
            body: 'Menu update have been failed',
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
});
</script>

<style scoped lang="scss"></style>
