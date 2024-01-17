import ReactDom from '@/core/ReactDom.ts'
import React from '@/core/React.ts'
import App from '@/App'

ReactDom.createRoot(document.querySelector('#root')!).render(
  <App></App>,
)
