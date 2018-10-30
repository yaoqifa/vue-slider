<template lang="pug">
  section
    nav.nav-wrap
      div.content
        div.nav-item(v-for="item in navList",
          :class="{active: item.index === navigation}",
          @click="clickNavItem(item.index)"
        ) {{item.name}}
          div.item-bottom
</template>

<style lang="stylus" scoped>
  section
    max-width 540px
    font-size 14px
    margin auto
    @media screen and (min-width: 1024px)
      max-width: 1024px
  .nav-wrap
    position relative
    height 40px
    background #fff
    &::before
      content ''
      position absolute
      bottom 0
      left 0
      width 100%
      height 1px
      transform scaleY(.5)
      background #e7e7e7
  .content
    display flex
    align-items center
    justify-content center
    text-align center
    .nav-item
      flex 1
      line-height 40px
      position relative
      .item-bottom
        position absolute
        bottom 6px
        left 50%
        margin-left -20px
        width 40px
        height 2px
        background #fb7299
        transform scaleX(0)
        transition all .3s ease
        border-radius 1px
      &.active
        color #fb7299
        .item-bottom
          transform scaleX(1)

</style>

<script lang="ts" src="./navigation.ts"></script>