import React from './core/React.ts'

interface IProp {
  age: number
  name: string
}

function Person(props: IProp) {
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

function App() {
  return (
    <div id="hhhh">
      <Person name="akong" age={18}></Person>
      <Person name="akong" age={18}></Person>
      <div>
        a
        <div>
          b
          <div>
            pp
          </div>
          <div>
            d
            <div>e</div>
            <div>f</div>
          </div>
        </div>
        <div>
          c
          <div>j</div>
          <div>h</div>
        </div>
      </div>
    </div>
  )
}

export default App
