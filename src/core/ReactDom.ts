import type { ElementItem } from './React.ts'
import React from './React.ts'

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
