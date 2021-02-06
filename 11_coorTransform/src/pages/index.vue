<template>
  <div class="main-index">
    <Header />
    <page-content></page-content>
    <footer-content></footer-content>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from '../components/0_header/Header'
import PageContent from '../components/PageContent'
import FooterContent from '../components/0_header/Footer'
export default {
  data () {
    return {
    }
  },
  components: {
    Header,
    PageContent,
    FooterContent
  }
}
</script>

<style scoped lang="scss">
</style>
