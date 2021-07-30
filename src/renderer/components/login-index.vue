<template>
  <div class="header">
    <img src="../assets/svg/close.svg" alt="X" class="close" @click="closeHandler">
    <div class="locale" @click="langChange">
      {{ $t(localeList[localeIndex]) }}
      <img src="../assets/svg/arrow-down.svg" alt="" class="arrow-down">
      <div class="locale-change" :class="{'none': !showLocaleChange}">
        <ul>
          <li @click.stop="toCN">简体中文</li>
          <li class="split-line"></li>
          <li @click.stop="toTW">繁体中文</li>
          <li class="split-line"></li>
          <li @click.stop="toUK">English(UK)</li>
        </ul>
      </div>
    </div>
    <img v-if="canBack" src="../assets/svg/back.svg" alt="<" class="back" @click="backHandler">
  </div>

  <div class="body">
    <component v-bind:is="scope.currentComponent" :scope="scope"></component>
  </div>

  <div v-if="scope.currentOrg && scope.currentComponent==='step-2'" class="footer clearfix">
    <div class="org-info">
      {{ scope.currentOrg.orgName }}
    </div>
    <div class="change-org" @click="changeOrgHandler">
      {{ $t('login.changeOrg') }}
      <img class="arrow-right" src="../assets/svg/arrow-right-green.svg" alt=">">
    </div>
  </div>
</template>

<script>
import loginStepOne from '/@/components/login-step-1.vue'
import loginStepTwo from '/@/components/login-step-2.vue'
import loginStepThree from '/@/components/login-step-3.vue'
import { useIpc } from '../composables'

const { invoke } = useIpc()

export default {
  components: {
    'step-1': loginStepOne,
    'step-2': loginStepTwo,
    'step-3': loginStepThree
  },

  data() {
    return {
      scope: {
        currentComponent: '',
        currentOrg: null
      },
      localeList: ['cn', 'tw', 'uk'],
      localeIndex: 0,
      showLocaleChange: false
    }
  },

  computed: {
    canBack() {
      return this.scope.currentComponent !== 'step-1';
    },
    historyOrg() {
      return JSON.parse(localStorage.getItem('org'));
    }
  },

  methods: {
    backHandler() {
      const curStep = this.scope.currentComponent
      this.scope.currentComponent = curStep.substring(0, curStep.length - 1) + (curStep.charAt(curStep.length - 1) - 1);
    },

    langChange() {
      this.showLocaleChange = !this.showLocaleChange;
    },
    closeLangChange() {
      this.$i18n.locale = this.localeList[this.localeIndex];
      this.showLocaleChange = false;
    },
    toCN() {
      this.localeIndex = 0;
      this.closeLangChange();
    },
    toTW() {
      this.localeIndex = 1;
      this.closeLangChange();
    },
    toUK() {
      this.localeIndex = 2;
      this.closeLangChange();
    },

    closeHandler() {
      invoke('closeApp');
    },

    changeOrgHandler() {
      this.scope.currentComponent = 'step-1';
      this.scope.currentOrg = null;
    },
  },

  mounted() {
    this.scope.currentComponent = this.historyOrg ? 'step-2' : 'step-1';
    this.scope.currentOrg = this.historyOrg ? this.historyOrg : null;
  }
}
</script>

<style lang="scss" scoped>
  .header {
    padding: 26px 32px 28px;
    height: 74px;
    vertical-align: center;

    .back {
      float: left;
      width: 20px;
      height: 20px;
    }

    .close {
      float: right;
      margin-left: 32px;
      margin-top: 2px;
      width: 16px;
      height: 16px;
    }

    .locale {
      float: right;
      height: 20px;
      text-align: right;
      line-height: 20px;
      font-size: 20px;
      color: #828394;
      cursor: pointer;

      .locale-change {
        position: relative;
        z-index: 1;
        top: 4px;
        width: 202px;
        height: 144px;
        background: #FFFFFF;
        box-shadow: 0 4px 24px rgba(6, 1, 25, 0.1);
        border-radius: 8px;
        color: #262833;

        li {
          padding: 12px 0;
          height: 48px;
          font-size: 20px;
          line-height: 24px;
          text-align: center;

          &:hover {
            color: #20BEC9;
          }
        }

        li.split-line {
          padding: 0;
          height: 0;
          width: 75%;
          margin: auto;
          border: 1px solid #E8EAEC;
        }
      }

      .arrow-down {
        display: inline-block;
      }
    }
  }

  .footer {
    position: relative;
    width: 400px;
    margin: 82px auto 0;

    .org-info {
      float: left;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      width: 200px;
      height: 44px;
      text-align: left;
      font-size: 20px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .change-org {
      float: left;
      width: 200px;
      color: #20BEC9;
      text-align: right;
      font-size: 20px;
      line-height: 22px;

      .arrow-right {
        position: relative;
        width: 8px;
        height: 8px;
      }
    }
  }
</style>
