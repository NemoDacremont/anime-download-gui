
//declare module '*.vue' {
  //import { DefineComponent } from 'vue';
  //const component: DefineComponent;
  //export default component;
//}


/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
