/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:09:43
 * @LastEditTime: 2024-01-18 17:31:36
 * @Description: 
 */
import React from './core/react.js';

// const App = React.createElement('div', {id: 'hi', className: 'hello'}, 'mini-', 'react')
let counterFoo = 0;
function Foo(){
  console.log('foo')
  const update = React.update();
  function add(){
    counterFoo++;
    update();
  }
  return (
    <div>
      foo: {counterFoo}
      <button onClick={add}>add</button>
    </div>
  )
}

let counterBar = 0;
function Bar(){
  console.log('bar')
  const update = React.update();
  function add(){
    counterBar++;
    update();
  }
  return (
    <div>
      bar: {counterBar}
      <button onClick={add}>add</button>
    </div>
  )
}

// let showBar = false;
// function Counter(){
//   function Foo() {
//     return (  
//     <div>
//       foo
//       <span>child1</span>
//       <span>child2</span>
//     </div>
//   );
//   }
  
//   const bar = <div>bar</div>;

//   function change(){
//     showBar = !showBar;
//     console.log({showBar})
//     React.update();
//   }
//   return (
//     <div>
//       <button onClick={change}>change dom</button>
//       <div> 
//         {showBar ? bar : <Foo/>}
//       </div>
//     </div>

//   )
// }
let counterApp = 0;
function App(){
  console.log('app')
  const update = React.update();
  function add(){
    counterApp++;
    update();
  }
  return (
    <div>
      mini-react: {counterApp}
      <button onClick={add}>add</button>
      <Foo/>
      <Bar/>
      
    </div>
  )
}
export default App;