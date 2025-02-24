import { mount } from 'svelte'
import './app.css'
import Init from "./Init.svelte";
import {ConnectionManager} from "./lib/tools/connection/ConnectionManager";

const app = mount(Init, {
  target: document.getElementById('app')!,
})

ConnectionManager.init();

export default app
