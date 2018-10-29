<template lang="pug">
  div.slider-container(ref="sliderCtr")
    div.slider-wrapper(ref="sliderWrap")
      slot
</template>

<style lang="stylus" scoped>
  .slider-container
    position absolute
    top 30px
    bottom 0
    max-width 540px
    width 100%
    overflow hidden
    @media screen and (min-width: 1024px)
      max-width 1024px

  .slider-wrapper
    position relative
    width 100%
    height 100%

</style>

<script lang="ts" src="./slider.ts"></script>
