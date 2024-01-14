/*
 * @Author: Ada J
 * @Date: 2024-01-13 22:00:31
 * @LastEditTime: 2024-01-14 18:05:42
 * @Description: 
 */

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
      nodeValue: text,
      children: []
    }
  }  
}

function render(container, el){
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el] 
    }
  }
}

function createDom(type){
  return type === 'TEXT_EL' ? document.createTextNode('') : document.createElement(type); 
}

function updateProps(dom, props){
  Object.keys(props).forEach(prop => {
    if(prop !== 'children') dom[prop] = props[prop];
  })
}

function initChild(fiber){
  const children = fiber.props.children;
  let preListNode = null;
  children.forEach((child, idx) => {
    child = typeof child === 'string' ? createTextEl(child) : child;
    let unitListNode = {
      type: child.type,
      props: child.props,
      dom: null,
      child: null,
      parent: fiber,
      sibling: null
    }
    if(idx === 0){
      fiber.child = unitListNode;
    }else{
      preListNode.sibling = unitListNode;
    }
    preListNode = unitListNode;
  })
}

function performUnitOfWork(fiber){
  if(!fiber.dom){
    const dom = fiber.dom = createDom(fiber.type);
    updateProps(dom, fiber.props);   
    fiber.parent.dom.append(dom);    
  } 
  
  initChild(fiber);

  if(fiber.child) return fiber.child;
  if(fiber.sibling) return fiber.sibling;
  if(fiber.parent) return fiber.parent.sibling;

}

let nextUnitOfWork = null;
function workLoop(deadline){
  let taskPause = false;
  while(!taskPause){
    // run task
    if(nextUnitOfWork) nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    if(deadline.timeRemaining() < 1) taskPause = true;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

const React = {
  createElement,
  render
}
export default React;