/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:09:43
 * @LastEditTime: 2024-01-17 18:54:14
 * @Description: 
 */
import React from './core/react.js';

// const App = React.createElement('div', {id: 'hi', className: 'hello'}, 'mini-', 'react')
let counter = 0;
function Counter({num}){
  function increase(){
    counter++;
    // update props
    React.update();
  }
  return (
    <div>
      counter: {counter}
      <button onClick={increase}>add</button> 
    </div>
)}

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
      {counter}
      <Counter/>
    </div>
  )
}
export default App;