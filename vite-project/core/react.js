/*
 * @Author: Ada J
 * @Date: 2024-01-13 22:00:31
 * @LastEditTime: 2024-01-13 22:48:41
 * @Description: 
 */

// create vdom
function createElement(type, props, ...children){
  return {
    type,
    props: {
      ...props,
      children
    }
  }
}

function createTextEl(text){
  return {
    type: 'TEXT_EL',
    props: {
      text,
      children: []
    }
  }  
}

function render(container, el){
  let dom = null;
  if(el.type === 'TEXT_EL'){
    dom = document.createTextNode(el.props.text);
  }else{
    dom = document.createElement(el.type);  
  }
  Object.keys(el.props).forEach(prop => {
    if(prop !== 'children') dom[prop] = el.props[prop];
  })
  el.props.children.forEach(child => {
    child = typeof child === 'string' ? createTextEl(child) : child;
    render(dom, child);
  })
  container.append(dom);
}

const React = {
  createElement,
  render
}
export default React;