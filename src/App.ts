/** @format */

import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from './components/helloworld/HelloWorld.vue'
import Page2 from './components/page2/page2.vue'

@Component({
  components: {
    HelloWorld,
    Page2,
  },
})
export default class App extends Vue {}
