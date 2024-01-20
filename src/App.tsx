import React from './core/React.ts'

function Foo() {
  console.log('foo')
  const [count, setCount] = React.useState<number>(1)
  const [bar, setBar] = React.useState<string>('bar')
  return (
    <div>
      foo
      <button onClick={() => {
        console.log('onclick')
        setBar(bar => `${bar}bar`)
        setCount(1)
      }}
      >
        click
      </button>
      <div>{bar}</div>
      <div>{count}</div>
    </div>
  )
}

function App() {
  return (
    <div id="hhhh">
      <Foo></Foo>
    </div>
  )
}

export default App
