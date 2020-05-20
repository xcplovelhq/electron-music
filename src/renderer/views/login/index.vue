<template>
  <div class="g-login">
    <div class="m-drag"></div>
    <div class="m-close" @click="hanldeClose">
      <i class="iconfont">&#xe643;</i>
    </div>
    <div class="m-main">
      <div class="m-logo">
        <img src="@/assets/login-logo.png" />
      </div>
      <div class="m-input">
        <el-input v-model="phone" placeholder="请输入手机号">
          <i class="iconfont" slot="prefix">&#xe63a;</i>
        </el-input>
      </div>
      <div class="m-input" style="margin-top:10px;">
        <el-input v-model="password" show-password placeholder="请输入密码">
          <i class="iconfont" slot="prefix">&#xe630;</i>
        </el-input>
      </div>
      <el-button type="danger" @click="handleLogin">登录</el-button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapActions } from "vuex";
import { storage } from "@/lib/store";
export default {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["loginCellphone"]),
    hanldeClose() {
      ipcRenderer.send("closeWin");
    },
    handleLogin() {
      // ipcRenderer.send("setUserInfo");
      // ipcRenderer.send("closeWin");
      this.loginCellphone({
        phone: this.phone,
        password: this.password
      }).then(data => {
        if (data.code === 200) {
          storage("userInfo", data.profile);
          ipcRenderer.send("setUserInfo");
          ipcRenderer.send("closeWin");
        }
      });
    }
  }
};
</script>
<style lang="less">
.g-login {
  .m-drag {
    width: 100%;
    height: 40px;
    margin-bottom: 35px;
    -webkit-app-region: drag;
  }
  .m-close {
    position: absolute;
    left: 6px;
    top: 6px;
    cursor: pointer;
    .iconfont {
      cursor: pointer;

      font-size: 20px;
    }
  }
  .m-main {
    padding: 0 40px;
  }
  .m-logo {
    text-align: center;
    margin-bottom: 35px;
  }
  .m-input {
    .iconfont {
      font-size: 16px;
      line-height: 38px;
    }
  }
  .el-input__inner:focus {
    border: 1px solid #d53035;
  }
  .el-button {
    width: 100%;
    margin-top: 40px;
    background: @brand-color;
    &:hover {
      background: #d53035;
    }
  }
}
</style>
