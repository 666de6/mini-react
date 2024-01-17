/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:09:43
 * @LastEditTime: 2024-01-17 11:43:46
 * @Description: 
 */
import React from './core/react.js';

// const App = React.createElement('div', {id: 'hi', className: 'hello'}, 'mini-', 'react')
function Counter({num}){
  return (
    <div>counter: {num}</div>

  )
}
function Counter2(){
  return (
    <div>
      <Counter num={134}></Counter>  
    </div>

  )
}

function App(){
  return (
    <div>
      hi-
      <div>
        mini-
        <div>react</div>
      </div>
      <div>
        vite-
        <div>app</div>
      </div>
      <Counter num={10}/>
      <Counter2></Counter2> 
    </div>
  )
}
export default App;