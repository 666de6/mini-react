/*
 * @Author: Ada J
 * @Date: 2024-01-13 21:59:36
 * @LastEditTime: 2024-01-15 18:15:34
 * @Description: 
 */
import React from "./core/react.js";
// const App = React.createElement('div', {id: 'app', className: 'hello'}, 'hi-', 'mini-', 'react');
function Counter({num}){
  return <div>counter: {num}</div>
}

function Counterwrapper({num}){
  return <Counter num={num}></Counter>
}
const App = (
  <div>
    <div>
      Hi, fiber
      <Counter num={10}></Counter>
      <Counter num={66}></Counter>
      <Counterwrapper num={99}></Counterwrapper>     
    </div>
    
  </div>
)  
export default App;