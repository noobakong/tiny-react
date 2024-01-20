import React from './core/React.ts'

function Foo() {
  console.log('foo')
  const [count, setCount] = React.useState<number>(1)
  const [bar, setBar] = React.useState<string>('bar')

  React.useEffect(() => {
    console.log('init')
    return () => {
      console.log('unmount')
    }
  }, [])

  React.useEffect(() => {
    console.log('bar change', bar)
    return () => {
      console.log('bar change unmount', bar)
    }
  }, [bar])
  React.useEffect(() => {
    console.log('count change', count)
    return () => {
      console.log('count change unmount', count)
    }
  }, [count])
  return (
    <div>
      foo
      <button onClick={() => {
        console.log('onclick')
        setBar(bar => `${bar}bar`)
        setCount(count => count + 1)
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
