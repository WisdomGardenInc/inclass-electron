<template>
  <div class="wrapper">
    <div class="title mb-16"> {{ scope.currentOrg.orgName }} </div>

    <div class="button mb-5 mx-auto">
      <div v-if="isPublicCloud" class="btn-default" @click="pwdLogin">{{ $t('login.username_password_login') }}</div>
      <a v-else class="btn-primary" @click="toUniformLogin">
        <span>{{ $t("login.uniform_identification_login") }}</span>
        <div class="arrow-right-white"></div>
      </a>
    </div>
  </div>
</template>

<script>
import { mixin } from '../assets/js/mixin.js'

export default {
  mixins: [mixin],

  computed: {
    isPublicCloud() {
      return this.scope.currentOrg.isPublic
    },

    loginUrl() {
      if (this.isPublicCloud) {
        return 'https://tronclass.com.cn/inclass/courses'
      } else {
        return `${this.scope.currentOrg.apiUrl}/inclass/courses`
      }
    }
  },

  methods: {
    pwdLogin() {
      this.scope.currentComponent = 'step-3'
    },

    toUniformLogin() {
      if (this.loginUrl != null) {
        try {
          const feature = `top=0,left=0,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no,channelmode = yes,height=${screen.height},width=${screen.width}`
          window.open(this.loginUrl, '_blank', feature)
        } catch (e) { }
      }
    }
  },

  mounted() {
    localStorage.setItem('org', JSON.stringify(this.scope.currentOrg))
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;

  .title {
    height: 40px;
    line-height: 40px;
    font-size: 28px;
  }

  .tips {
    margin-bottom: 43px;
    font-size: 20px;
    color: #A9ACB8;
  }

  .button {
    width: 400px;

    .btn-primary {
      position: relative;
      display: inline-block;
      width: 400px;
      height: 56px;
      background-color: #20BEC9;
      border-radius: 36px;
      font-size: 24px;
      line-height: 56px;
      color: #FFFFFF;

      .arrow-right-white {
        display: inline-block;
        position: absolute;
        right: 20px;
        top: 22px;
        width: 12px;
        height: 12px;
        border-top: 2px solid #FFFFFF;
        border-right: 2px solid #FFFFFF;
        transform: rotate(45deg);
      }
    }

    .btn-default {
      height: 56px;
      border: 2px solid #DCDEE2;
      border-radius: 36px;
      font-size: 24px;
      line-height: 56px;
    }
  }
}
</style>
