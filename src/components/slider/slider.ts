/** @format */

import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

const transitionEnd = (function() {
  const style = document.body.style || document.documentElement.style
  const transitionEndEvent = {
    transition: 'transitionend',
    webkitTransition: 'webkitTransitionEnd',
  }
  for (const val of Object.keys(transitionEndEvent)) {
    if (style[val] !== undefined) {
      return transitionEndEvent[val]
    }
  }
})()

/**
 * Slider
 *
 * @class Slider
 * @extends {Vue}
 */
@Component
class Slider extends Vue {
  sliderCtr: HTMLElement = null
  sliderWrap: HTMLElement = null

  clientWidth: number = 0
  index: number = 0
  length: number = 0

  animating: boolean = false
  dragging: boolean = false

  direction: 'horizontal' | 'vertical' = null

  startX: number = 0
  startY: number = 0
  touchStartTime: number = 0
  distX: number = 0
  distY: number = 0
  translateX: number = 0

  speed: number = 300 // 动画过渡时间
  touchRatio: number = 0.45 // 移动系数
  critical: number = 0.3 // 临界系数

  @Prop({ type: Number })
  defaultIndex: number
  @Prop({ type: Function })
  slideChangeTransitionEnd: (index: number) => void

  translate(element: HTMLElement, offset: number, speed?: number, callback?: () => void) {
    const oldSty = element.style.cssText
    if (speed) {
      this.animating = true
      element.style.cssText =
        `${oldSty}` +
        `-webkit-transition: -webkit-transform ${speed}ms ease-in-out;` +
        `transition: transform ${speed}ms ease-in-out;` +
        `-webkit-transform: translate3d(${offset}px, 0, 0);` +
        `transform: translate3d(${offset}px, 0, 0);`

      let called = false
      const transitionEndCallback = () => {
        if (called) {
          return
        }
        called = true
        this.animating = false
        this.translateX = offset
        const style = element.style
        style.webkitTransition = ''
        style.webkitTransform = `translate3d(${offset}px, 0, 0)`
        if (callback) {
          callback.apply(this)
        }
      }

      element.removeEventListener(transitionEnd, transitionEndCallback)
      element.addEventListener(transitionEnd, transitionEndCallback)
    } else {
      element.style.cssText =
        `${oldSty}` +
        `-webkit-transform: translate3d(${offset}px, 0, 0);` +
        `transform: translate3d(${offset}px, 0, 0);`
    }
  }

  doAnimate(towards: 'left' | 'right', offset: number, callback?: () => void) {
    let index = this.index
    if (towards === 'left') {
      index += 1
      this.index = index >= this.length ? 1 : index
    } else if (towards === 'right') {
      index -= 1
      this.index = index < 0 ? 0 : index
    }
    const offsetX = -(this.index * offset)

    this.translate(this.sliderWrap, offsetX, this.speed, () => {
      this.distX = 0
      this.distY = 0
      this.slideChangeTransitionEnd(this.index)
    })
  }

  doOnTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX
    this.startY = event.touches[0].clientY
    this.touchStartTime = Date.now()
  }

  doOnTouchMove(event: TouchEvent) {
    this.distX = event.touches[0].clientX - this.startX
    this.distY = event.touches[0].clientY - this.startY
    // 横滑
    if (Math.abs(this.distX) > Math.abs(this.distY) && Math.abs(this.distX) > 0) {
      this.direction = !this.direction ? 'horizontal' : this.direction
    }
    // 竖滑
    if (Math.abs(this.distY) > Math.abs(this.distX) && Math.abs(this.distY) > 0) {
      this.direction = !this.direction ? 'vertical' : this.direction
    }
    this.distX = Math.round(this.distX * this.touchRatio)
    // 横滑动处理
    if (this.direction === 'horizontal') {
      event.stopPropagation()
      this.translate(this.sliderWrap, this.translateX + this.distX)
    }
  }

  doOnTouchEnd(event: TouchEvent) {
    const touchDuration = Date.now() - this.touchStartTime
    let towards: 'left' | 'right' = null
    if (touchDuration < 300 && Math.abs(this.distX) < 5) {
      return
    }
    event.preventDefault()
    event.stopImmediatePropagation()
    if ((touchDuration < 300 && Math.abs(this.distX) > 10) || Math.abs(this.distX) > this.clientWidth * this.critical) {
      towards = this.distX < 0 ? 'left' : 'right'
    }

    this.doAnimate(towards, this.clientWidth)
  }

  onTouchstart(event: TouchEvent) {
    if (this.animating) {
      return
    }
    this.dragging = true
    this.doOnTouchStart(event)
  }

  onTouchmove(event: TouchEvent) {
    if (!this.dragging) {
      return
    }
    this.doOnTouchMove(event)
  }

  onTouchend(event: TouchEvent) {
    if (!this.dragging) {
      return
    }
    this.dragging = false
    if (this.direction === 'vertical') {
      this.direction = null
      return
    }
    this.direction = null
    this.doOnTouchEnd(event)
  }

  goto(index: number) {
    this.index = index
    this.doAnimate(null, this.clientWidth)
  }

  init() {
    this.clientWidth = this.sliderCtr.clientWidth
    this.length = this.$children.length
    let width = 0
    this.$children.forEach((child) => {
      child.$el.style.width = this.clientWidth + 'px'
      width += this.clientWidth
    })
    this.sliderWrap.style.width = width + 'px'

    this.translateX = -this.index * this.clientWidth
    this.translate(this.sliderWrap, this.translateX)
  }

  created() {
    this.index = this.defaultIndex
  }

  mounted() {
    this.sliderCtr = this.$refs.sliderCtr as HTMLElement
    this.sliderWrap = this.$refs.sliderWrap as HTMLElement
    this.init()
    const element = this.$el
    element.addEventListener('touchstart', this.onTouchstart, false)
    element.addEventListener('touchmove', this.onTouchmove, false)
    element.addEventListener('touchend', this.onTouchend, false)

    this.$on('goto', this.goto)
  }
}

export default Slider
