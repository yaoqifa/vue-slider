/** @format */

import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

/**
 * 顶部导航
 *
 * @class Navigation
 * @extends {Vue}
 */
@Component
class Navigation extends Vue {
  navList: Array<{ name: string; index: number }> = [
    {
      name: 'tab1',
      index: 0,
    },
    {
      name: 'tab2',
      index: 1,
    },
    {
      name: 'tab3',
      index: 2,
    },
    {
      name: 'tab4',
      index: 3,
    },
  ]
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  navigation: number
  /**
   * 点击导航
   *
   * @param {any} index index
   * @memberof Navigation
   */
  clickNavItem(index) {
    this.$emit('change-navigation', index)
  }
}

export default Navigation
