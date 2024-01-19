import React from './core/React.ts'

interface IProp {
  age: number
  name: string
}

export function Person(props: IProp) {
  const { name, age } = props
  return (
    <div>
      my name is
      {' '}
      {name}
      , age is
      {' '}
      {age}
    </div>
  )
}

let countFoo = 1
function Foo() {
  console.log('foo')
  const update = React.update()
  return (
    <div>
      foo
      <button onClick={() => {
        console.log('onclick')
        countFoo++
        update()
      }}
      >
        click
        {' '}
        {countFoo}
      </button>
    </div>
  )
}

let countBar = 1
function Bar() {
  console.log('Barr')
  const update = React.update()
  return (
    <div>
      bar
      <button onClick={() => {
        console.log('onclick')
        countBar++
        update()
      }}
      >
        click
        {' '}
        {countBar}
      </button>
    </div>
  )
}

let a = 1
function App() {
  const update = React.update()
  return (
    <div id="hhhh">
      <button onClick={() => {
        console.log('onclick')
        a++
        update()
      }}
      >
        click
        {' '}
        {a}
      </button>
      <Foo></Foo>
      <Bar></Bar>
    </div>
  )
}

export default App
