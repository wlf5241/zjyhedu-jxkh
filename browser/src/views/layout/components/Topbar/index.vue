<template>
  <div class="topbar-container">
    <el-header>
      <div class="left-menu">
        <div class="left-menu-title">
          莲都区考生信息上报核对系统
        </div>
      </div>
      <div class="right-menu">
        <template v-if="device!=='mobile'">

          <screenfull class="right-menu-item hover-effect" />

          <!--el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
            <size-select class="right-menu-item hover-effect"/>
          </el-tooltip>

          <!lang-select class="right-menu-item hover-effect"/>

          <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
            <theme-picker class="right-menu-item hover-effect"/>
          </el-tooltip-->
        </template>

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                首页
              </el-dropdown-item>
            </router-link>
            <!--a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
              <el-dropdown-item>
                {{ $t('navbar.github') }}
              </el-dropdown-item>
            </a-->
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出登陆</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </el-header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Screenfull from '@/components/Screenfull'

export default {
  name: 'Topbar',
  components: {
    Screenfull
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .left-menu{
    float:left;
    height:100%;
    line-height:50px;

    &:focus {
      outline: none;
    }

    .left-menu-title {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      line-height: 50px;
      font-size: 24px;
      font-family: '黑体';
      color: #f3f3f3;
      vertical-align: text-bottom;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
