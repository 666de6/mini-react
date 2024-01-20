/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:09:43
 * @LastEditTime: 2024-01-20 15:46:19
 * @Description: 
 */
import React from './core/react.js';

// const App = React.createElement('div', {id: 'hi', className: 'hello'}, 'mini-', 'react')

const useEffect = React.useEffect;
function Foo(){
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState('bar');
  // after Dom render
  useEffect(() => {
    console.log('init')
    return () => {
      console.log('clean up in foo - []')
    }
  }, [])

  useEffect(() => {
    console.log('update in foo')
    return () => {
      console.log('clean up in foo')
    }
  }, [count, bar])
  
  
  function add(){
    setCount((c) => c + 1);
    setBar('bar');
  }
  return (
    <div>
      foo: {count}
      <div></div>
      non-change: {bar}
      <button onClick={add}>add</button>
    </div>
  )
}
function App(){
  const [display, setDisplay] = React.useState(false);  
  useEffect(() => {
    console.log('update in app')
    return () => {
      console.log('clean up in app')
    }
    
  }, [display])
  
  function toggle(){
    setDisplay(d => d = !d);
  } 
  return (
    <div>
      <button onClick={toggle}>toggle</button>
      <div>
        {display ? 'mini-react' : 'vite-app' }
      </div>
      <Foo/>
    </div>
  )
}
export default App;