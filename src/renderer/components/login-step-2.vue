<template>
  <div class="wrapper">
    <div class="title">{{ $t("common.login") }}</div>

    <div class="tips">
      {{ $t("login.login_method_tip") }}
    </div>

    <div class="button">
      <a v-if="!isPublicCloud" class="btn-primary" :href="loginUrl" target="_blank">
        <span>{{ $t("uniform_identification_login") }}</span>
        <img class="arrow-right" src="../assets/svg/arrow-right-white.svg" alt=">">
      </a>
      <div class="btn-default" @click="pwdLogin">{{ $t('login.username_password_login') }}</div>
    </div>
  </div>

  <div>{{ scope.currentOrg.isPublic }}</div>
</template>

<script>
import { mixin } from '../assets/js/mixin.js'

export default {
  mixins: [mixin],

  computed: {
    isPublicCloud() {
      return this.scope.currentOrg.isPublic ? this.scope.currentOrg.isPublic : false;
    },

    loginUrl() {
      if (this.isPublicCloud) {
        return 'https://tronclass.com.cn/login';
      } else {
        return `${this.scope.currentOrg.apiUrl}/login`;
      }
    }
  },

  methods: {
    pwdLogin() {
      this.scope.currentComponent = 'step-3';
    }
  },

  mounted() {
    localStorage.setItem('org', JSON.stringify(this.scope.currentOrg));
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
    margin-bottom: 12px;
  }

  .tips {
    margin-bottom: 43px;
    font-size: 20px;
    color: #A9ACB8;
  }

  .button {
    margin: auto;
    width: 400px;

    .btn-primary {
      position: relative;
      display: inline-block;
      width: 400px;
      height: 56px;
      margin-bottom: 20px;
      background-color: #20BEC9;
      border-radius: 36px;
      font-size: 24px;
      line-height: 56px;
      color: #FFFFFF;

      .arrow-right {
        position: absolute;
        right: 15px;
        top: 20px;
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
