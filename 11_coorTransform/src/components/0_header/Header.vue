<!--
 * @Author: 郑杰14
 * @Date: 2020-07-30 16:09:55
 * @LastEditors: 郑杰14
 * @LastEditTime: 2020-08-01 11:38:11
 * @Description:
-->
<template>
  <header class="header">
    <section class="header-name">
      <img :src="logo"
           alt="">
      <span>坐标系转换工具</span>
    </section>
  </header>
</template>

<script>
import logo from './../../assets/images/logo.png'
export default {
  name: 'Header',
  data () {
    return {
      logo: logo
    }
  }
}
</script>
<style lang="scss">
.header {
  display: flex;
  padding: 0.2rem;
  height: 0.76rem;

  .header-name {
    width: 5rem;

    img {
      width: 0.5rem;
    }

    span {
      margin-left: 0.3rem;
      font-size: 0.26rem;
      font-weight: 700;
      line-height: 0.4rem;
      color: gray;
    }
  }

  .header-menu {
    flex: 1 1;
    display: flex;
    justify-content: flex-end;
    li {
      width: 1rem;
      margin-left: 0.2rem;
      line-height: 0.96rem;

      a {
        font-size: 0.2rem;
        color: black;
      }

      .router-link-exact-active {
        color: #409eff;
      }
    }
  }
}
</style>
