/** @format */

import { Component, Vue } from 'vue-property-decorator'
import Navigation from './components/navigation/navigation.vue'
import HelloWorld from './components/helloworld/HelloWorld.vue'
import Slider from './components/slider/slider.vue'

@Component({
  components: {
    Navigation,
    HelloWorld,
    Slider,
  },
})
export default class App extends Vue {
  defaultIndex: number = 0
  navigation: number = 0
  /**
   * 点击导航触发左右滑动
   *
   * @param {*} type
   * @memberof App
   */
  changeNavigation(index: number) {
    this.defaultIndex = index
    const slider: Vue = this.$refs.slider as Vue
    slider.$emit('goto', this.defaultIndex)
  }

  /**
   * 滑动后触发联动导航
   *
   * @param {*} index
   * @memberof App
   */
  slideChangeTransitionEnd(index) {
    this.navigation = index
  }
}
