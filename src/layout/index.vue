<template>
  <div>
    <div class="box-header">
      <div class="box-headleft">
        <img :src="logoImg" mode class="imgLogo" />
        <p>读书活动后台管理平台</p>
      </div>
      <div class="box-headerRight">
        <!-- <div class="rightbox">
          <img :src="message" mode class="imgRight" />
          <span class="circle">36</span>
          <span class="shu">|</span>
        </div> -->
        <div class="rightbox">
          <img :src="user" mode class="imgRight" />
          <span>系统管理员</span>
          <!-- <span class="shu">|</span> -->
        </div>
        <!-- <div class="rightbox">
          <img :src="out" mode class="imgRight"  @click="logout"/>
        </div> -->
      </div>
    </div>
    <!-- :class="classObj" -->
    <div  class="app-wrapper">
      <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}"  class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <!-- <navbar /> -->
          <tags-view v-if="needTagsView"/>
        </div>
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView,} from "./components";
import logoImg from "@/assets/png/logo1.png";
import message from "@/assets/png/message.png";
import out from "@/assets/png/out.png";
import user from "@/assets/png/user.png";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      logoImg,
      message,
      out,
      user
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
     needTagsView() {
        return this.$store.state.settings.tagsView
      },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
     async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: relative;
    // top: 0;
  }
}
.box-header {
  position: absolute;
  top: 0;
  z-index: 99;
  width: 100%;
  color: #fff;
  background: #0e946d;
  display: flex;
  justify-content: space-between;
  .box-headleft {
    display: flex;
    align-items: center;
    p {
      font-weight: 600;
    }
    .imgLogo {
      width: 26px;
      height: 26px;
      margin-right: 10px;
      margin-left: 15px;
    }
  }
  .box-headerRight {
    margin-right: 20px;
    display: flex;
    align-items: center;
    .rightbox {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .circle {
        position: relative;
        font-size: 12px;
        color: #fff;
        border-radius: 50%;
        display: inline-block;
        background: red;
        padding: 1px;
        left: -18px;
        top: -5px;
        margin-right: -15px;
      }
      .imgRight {
        width: 22px;
        height: 24px;
        margin-right: 10px;
      }
      .shu {
        margin-left: 20px;
      }
    }
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 50px;
  height: 100%;
  position: absolute;
  z-index: 999;
}
// .main-container{
//   top: 50px;
// }
.fixed-header {
  position: fixed;
  top: 50px;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
