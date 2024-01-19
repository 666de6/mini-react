/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:09:43
 * @LastEditTime: 2024-01-19 13:02:36
 * @Description: 
 */
import React from './core/react.js';

// const App = React.createElement('div', {id: 'hi', className: 'hello'}, 'mini-', 'react')

function Foo(){
  console.log('foo')
  const [count, setCount] = React.useState(10);
  const [num, setNum] = React.useState(0);
   
  const [bar, setBar] = React.useState('bar');
  function add(){
    setCount((c) => c + 1);
    // setBar('hi');
    // setNum(n => n + 2);
    setBar(() => 'hi');
  }
  return (
    <div>
      foo: {count}
      <div>
        {bar}
      </div>
      <div>
        num: {num}
      </div>
      <button onClick={add}>add</button>
    </div>
  )
}
function App(){
  console.log('app')
  return (
    <div>
      mini-react
      <Foo/>
    </div>
  )
}
export default App;