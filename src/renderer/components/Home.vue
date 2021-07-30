<template>
  <div class="container">
    <div class="w-full">
      <a-select
        class="form-control w-full"
        showSearch
        placeholder="org select"
        size="large"
        @search="getOrgs"
        @change="orgChanged"
        v-model:value="selectedOrg"
        :filterOption="false"
      >
        <a-select-option
          :value="org"
          v-for="org in filteredOrgs"
          :key="orgKey(org)"
        >
          {{ org.orgName }}
        </a-select-option>
      </a-select>
    </div>

    <div class="w-full">
      {{ selectedOrg }}
    </div>

    <div class="w-full" v-if="selectedOrg">
      <div class="card" v-if="!selectedOrg.isPublic">
        <a :href="selectedOrg.apiUrl + '/login'" target="_blank"
          >统一身份认证登录</a
        >
      </div>
      <div class="card">
<!--        <a href="https://lms-qa.tronclass.com.cn/login?no_cas" target="_blank"-->
<!--          >公有云登录</a-->
<!--        >        -->
        <a href="https://wwww.baidu.com" target="_blank">公有云账号密码登陆</a>
      </div>
    </div>
  </div>
</template>

<script lang=ts>
import { defineComponent, reactive, ref } from 'vue'
import SumEquation from './SumEquation.vue'

import { orgs } from '../../shared/orgs.json'
import { useIpc } from '../composables'

export default defineComponent({
  components: {
    SumEquation
  },
  setup(props, context) {
    const { invoke } = useIpc()

    const filteredOrgs = ref<Org[]>([]);

    const selectedOrg = ref<null | Org>(null);

    const getOrgs = (keyword = '') => {
      if (!keyword) {
        return;
      }

      filteredOrgs.value = (orgs as Org[]).filter((org) => {
        return org.orgName.includes(keyword)
      })
    }

    const orgKey = (org: any): string => {
      return `${org.id}|${org.isPublic || ''}|${org.orgName}`;
    }

    const orgChanged = (org: any) => {
      invoke('orgChanged', JSON.stringify(selectedOrg.value))
      console.log(org)
    }
    return {
      filteredOrgs, orgs, getOrgs, orgKey, orgChanged, selectedOrg
    }
  }
})
</script>
<style lang="scss" scoped>
.w-full {
  width: 100%;
}
</style>
