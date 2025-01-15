import { mount } from 'svelte'
import './app.css'
import Init from "./Init.svelte";

const app = mount(Init, {
  target: document.getElementById('app')!,
})

export default app
