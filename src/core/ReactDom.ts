import React from './React.ts'
import type { ElementItem } from '@/type/index.ts'

function createRoot(container: HTMLElement) {
  return {
    render: (el: ElementItem) => {
      React.render(el, container)
    },
  }
}

export default {
  createRoot,
}
