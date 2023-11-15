<template>
  <div class="wrapper">
    <div class="title">{{ $t('login.orgName') }}</div>
    <a-select class="form-control" showSearch :placeholder="$t('login.input_org_name')" size="large" @search="getOrgs"
      @change="orgChanged" v-model:value="selectedOrg" :filterOption="false"
      :notFoundContent="$t('login.invalid_org_name')">
      <a-select-option :value="org" v-for="org in filteredOrgs" :key="orgKey(org)">
        {{ org.orgName }}
      </a-select-option>
    </a-select>
    <div class="button submit" :class="{ 'mask': !selectedOrg }" @click="handleSubmit">{{ $t("common.confirm") }}</div>
  </div>
</template>

<script>
import { orgs } from '../../shared/orgs.json'
import { useIpc } from '../composables'
import { mixin } from '../assets/js/mixin.js'

const { invoke } = useIpc()

export default {
  mixins: [mixin],

  data() {
    return {
      filteredOrgs: [],
      selectedOrg: null
    }
  },

  methods: {
    getOrgs(keyword) {
      if (!keyword) {
        this.filteredOrgs = []
        return
      }
      this.filteredOrgs = orgs.filter((org) => {
        return org.orgName.includes(keyword)
      })
    },

    orgKey(org) {
      return `${org.objectId}|${org.isPublic}|${org.orgName}`
    },

    orgChanged(org) {
      if (org) {
        invoke('orgChanged', JSON.stringify(this.selectedOrg))
      }
    },

    handleSubmit() {
      if (!this.selectedOrg) {
        return
      }
      this.scope.currentComponent = 'step-2'
      this.scope.currentOrg = this.selectedOrg
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;

  .title {
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    font-size: 28px;
  }

  .form-control {
    position: relative;
    margin: 43px 0 50px;
    font-size: 24px;
    outline: none;

    ::v-deep(.ant-select-selector) {
      width: 400px;
      height: 56px !important;
      border: 2px solid #DCDEE2;
      border-radius: 4px;
      font-size: 24px;

      .ant-select-selection-search {
        margin: auto;
        display: inline-block;
        line-height: 24px;

        input {
          margin-left: 10px;
          height: 100% !important;
          line-height: 56px;
        }
      }

      .ant-select-selection-item {
        display: inline-block;
        margin-left: 10px;
        line-height: 56px;
        text-align: left;
      }

      .ant-select-selection-placeholder {
        display: inline-block;
        margin-left: 10px;
        line-height: 56px;
        text-align: left;
        font-size: 24px;
        color: #C5C8CE;
      }
    }

    ::v-deep(.ant-select-arrow) {
      position: absolute;
      display: none;
      right: 30px;
      top: 24px;
      font-size: 24px;
    }
  }

  .submit {
    margin: auto;
    width: 400px;
    height: 56px;
    border-radius: 36px;
    background-color: #20BEC9;
    text-align: center;
    font-size: 24px;
    line-height: 56px;
    color: #FFFFFF;
  }

  .mask {
    opacity: 35%;
  }
}
</style>
