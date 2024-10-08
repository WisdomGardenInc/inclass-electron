<template>
  <div class="header">
    <img src="../assets/svg/close.svg" alt="X" class="close cursor-pointer" @click="closeConfirm">
    <div class="locale" @click="langChange">
      {{ $t($i18n.locale) }}
      <div :class="[showLocaleChange ? 'arrow-up' : 'arrow-down']"></div>
      <div class="locale-change" :class="{ 'none': !showLocaleChange }">
        <ul>
          <li @click.stop="toCN">简体中文</li>
          <li class="split-line"></li>
          <li @click.stop="toTW">繁体中文</li>
          <li class="split-line"></li>
          <li @click.stop="toUK">English(UK)</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="body">
    <component v-bind:is="scope.currentComponent" :scope="scope"></component>
  </div>
</template>

<script>
import OrgSelect from '/@/components/org-select.vue'
import UnifiedLogin from '/@/components/unified-login.vue'
import loginStepThree from '/@/components/login-step-3.vue'
import { useIpc } from '../composables'
import { Modal } from 'ant-design-vue'
import { orgs } from '/@shared/orgs.json'

const { invoke } = useIpc()

export default {
  components: {
    'step-1': OrgSelect,
    'step-2': UnifiedLogin,
    'step-3': loginStepThree
  },

  data() {
    return {
      scope: {
        currentComponent: '',
        currentOrg: null
      },
      showLocaleChange: false
    }
  },

  computed: {
    canBack() {
      return this.scope.currentComponent !== 'step-1'
    },
    historyOrg() {
      return JSON.parse(localStorage.getItem('org'))
    }
  },

  methods: {
    backHandler() {
      const curStep = this.scope.currentComponent
      this.scope.currentComponent = curStep.substring(0, curStep.length - 1) + (curStep.charAt(curStep.length - 1) - 1)
    },

    langChange() {
      this.showLocaleChange = !this.showLocaleChange
    },
    toCN() {
      this.$i18n.locale = 'cn'
      this.showLocaleChange = false
    },
    toTW() {
      this.$i18n.locale = 'tw'
      this.showLocaleChange = false
    },
    toUK() {
      this.$i18n.locale = 'uk'
      this.showLocaleChange = false
    },

    closeConfirm() {
      Modal.confirm({
        title: this.$t('common.exitConfirm'),
        okText: this.$t('common.confirm'),
        cancelText: this.$t('common.cancel'),
        onOk() {
          invoke('closeApp')
        }
      })
    },

    changeOrgHandler() {
      this.scope.currentComponent = 'step-1'
      this.scope.currentOrg = null
    }
  },

  mounted() {
    this.scope.currentComponent = 'step-2'
    this.scope.currentOrg = orgs.find(org => org.deliveryOrg === 'XMU')

    invoke('orgChanged', JSON.stringify(this.scope.currentOrg))

    if (!this.$i18n.locale) {
      this.$i18n.locale = 'cn'
    }
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
      position: relative;
      top: -3px;
      left: 5px;
      width: 10px;
      height: 10px;
      border-right: 2px solid #C5C8CE;
      border-bottom: 2px solid #C5C8CE;
      transform: rotate(45deg);
    }

    .arrow-up {
      display: inline-block;
      position: relative;
      top: 1px;
      left: 5px;
      width: 10px;
      height: 10px;
      border-right: 2px solid #C5C8CE;
      border-bottom: 2px solid #C5C8CE;
      transform: rotate(225deg);
    }
  }
}

.footer {
  position: relative;

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
    color: #20BEC9;
    text-align: right;
    font-size: 20px;
    line-height: 22px;

    .arrow-right-green {
      display: inline-block;
      position: relative;
      width: 8px;
      height: 8px;
      top: -1px;
      left: 4px;
      border-top: 2px solid #20BEC9;
      border-right: 2px solid #20BEC9;
      transform: rotate(45deg);
    }
  }
}
</style>
