<template>
  <div class="wrapper">
    <div class="title">{{ $t("login.passwordLogin") }}</div>
    <div class="input">
      <input class="username mb-6 placeholder-[#C5C8CE]" :class="{ 'default': !errorMessage, 'has-err': errorMessage }"
        type="text" v-model="username" :placeholder="$t('login.username_input')">
      <input class="password placeholder-[#C5C8CE]" :class="{ 'default': !errorMessage, 'has-err': errorMessage }"
        type="password" v-model="password" :placeholder="$t('login.password_input')">
      <div class="errMsg">{{ errorMessage }}</div>
      <div class="button btn-primary" :class="{ 'mask': !validInput }" @click="handleSubmit">{{ $t('common.login') }}
      </div>
    </div>
  </div>
</template>

<script>
import { mixin } from '../assets/js/mixin.js'
import { useIpc } from '../composables'
import { login } from '../assets/js/tc_login'

const { invoke } = useIpc()

export default {
  mixins: [mixin],

  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },

  computed: {
    validInput() {
      return this.username && this.password
    }
  },

  methods: {
    handleSubmit() {
      const params = {
        org_id: this.scope.currentOrg.id,
        user_name: this.username,
        password: this.password,
        remember: false
      }

      login(params).then(response => {
        const nextPageParams = {
          next_url: 'https://tronclass.com.cn/inclass/courses',
          user_id: response.data.user_id
        }
        invoke('open-inclass-list', nextPageParams);
      }).catch(() => {
        this.errorMessage = this.$t('login.invalid_username_or_password');
      })
    }
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

  .input {
    margin: 40px auto 0;
    width: 400px;

    input {
      border-radius: 3px;
      display: block;
      width: inherit;
      height: 56px;
      font-size: 24px;
      line-height: 48px;
      border: 1px solid #E8EAEC;
      padding: 9px 12px;
    }

    .default {
      border-bottom: 2px solid #E8EAEC;
    }

    .has-err {
      border-bottom: 2px solid #FF5734;
    }

    .errMsg {
      margin-top: 8px;
      width: 400px;
      height: 28px;
      font-size: 20px;
      line-height: 28px;
      color: #FF5734;
      text-align: left;
    }

    .btn-primary {
      margin-top: 14px;
      width: 400px;
      height: 56px;
      background: #20BEC9;
      border-radius: 36px;
      color: #FFFFFF;
      font-size: 24px;
      line-height: 56px;
    }

    .mask {
      opacity: 35%;
    }
  }
}
</style>
