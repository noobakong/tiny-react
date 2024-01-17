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

let a = 1
function App() {
  return (
    <div id="hhhh">
      <button onClick={() => {
        console.log('onclick')
        a++
        React.update()
      }}
      >
        {a}
      </button>
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
