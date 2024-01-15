import React from './core/React.ts'

const App = (
  <div id="hhhh">
    <div>good</div>
    {/* @ts-expect-error */}
    <div style="background: red">hello </div>
    tiny-react
    <div>
      dddd
      <div>cccc</div>
    </div>
  </div>
)

export default App
