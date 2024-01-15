import React from './React.js'

function createRoot(container) {
  return {
    render: (el) => {
      React.render(el, container)
    },
  }
}

export default {
  createRoot,
}
