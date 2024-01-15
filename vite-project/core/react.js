/*
 * @Author: Ada J
 * @Date: 2024-01-13 22:00:31
 * @LastEditTime: 2024-01-15 18:16:23
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
  root = nextUnitOfWork;
}

function createDom(type){
  return type === 'TEXT_EL' ? document.createTextNode('') : document.createElement(type); 
}

function updateProps(dom, props){
  Object.keys(props).forEach(prop => {
    if(prop !== 'children') dom[prop] = props[prop];
  })
}

function initChild(fiber, children){
  let preListNode = null;
  children.forEach((child, idx) => {
    const typeText = typeof child === 'string' || typeof child === 'number';
    child = typeText ? createTextEl(child) : child;
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
function commitRoot(){
  commitUnit(root.child);
  root = null;
}
function commitUnit(fiber){
  if(!fiber) return;
  let fiberParent = fiber.parent;
  while(!fiberParent.dom){
    fiberParent = fiberParent.parent;
  }
  fiber.dom && fiberParent.dom.append(fiber.dom);
  commitUnit(fiber.child);
  commitUnit(fiber.sibling);
}

function updateFunctionalComp(fiber){
  let children = [fiber.type(fiber.props)];
  initChild(fiber, children);

}

function updateOthers(fiber){
  if(!fiber.dom){
    const dom = fiber.dom = createDom(fiber.type);
    updateProps(dom, fiber.props);
  } 
  initChild(fiber, fiber.props.children);
}

function performUnitOfWork(fiber){
  const isFunctionalComp = typeof fiber.type === 'function';
  if(isFunctionalComp){
    updateFunctionalComp(fiber); 
  }else{
    updateOthers(fiber);
  }

  if(fiber.child) return fiber.child;
  
  let newFiber = fiber;
  while(newFiber){
    if(newFiber.sibling) return newFiber.sibling;
    newFiber = newFiber.parent;
  } 

}

let nextUnitOfWork = null;
let root = nextUnitOfWork;

function workLoop(deadline){
  let taskPause = false;
  while(!taskPause){
    // run task
    if(nextUnitOfWork) nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    taskPause = deadline.timeRemaining() < 1;
  }
  if(!nextUnitOfWork && root){
    commitRoot()
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

const React = {
  createElement,
  render
}
export default React;