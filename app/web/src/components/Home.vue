<template>
  <section>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <a href="/"><img class="super-justice" :src="headerImage"></a>
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
        <h1 class="super-header">{{subtitle}}</h1>
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-3">
      </div>
      <div class="col-lg-18">
        <at-button-group>
          <at-button @click="link('Rating')" icon="icon-star" class="mid-btn" type="primary"  hollow>Start Rating</at-button>
          <at-button @click="link('Leaderboard')" icon="icon-bar-chart-2" class="mid-btn" type="success" hollow>View Leaderboard</at-button>
           <a href="https://github.com/Azure/build2018-container-demo" target="_blank"><at-button icon="icon-github" class="mid-btn" type="info" hollow>Steal this code</at-button></a>
        </at-button-group>
      </div>
      <div class="col-lg-3">
      </div>
    </div>
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-24">
      </div>
      </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      headerImage: "",
      subtitle: "",
      errors: [],
      pageName: 'Home'
    };
  },
  created() {
    var page = this.$siteLayout[this.pageName]
    document.title = page.title
    this.headerImage = page.headerImage
    this.subtitle = page.subtitle
  },
  methods: {
    link(rel) {
      this.$router.push({ name: rel })
    }
  }
}
</script>
