/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:14:57
 * @LastEditTime: 2024-01-17 11:50:47
 * @Description: 
 */
function createElement(type, props, ...children){
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const textType = typeof child === 'string' || typeof child === 'number';
        return textType ? createTextEl(child) : child;
      })
    }
  }
}

function createTextEl(nodeValue){
  return {
    type: 'TEXT_EL',
    props: {
      nodeValue,
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
    if(prop !== 'children'){
      dom[prop] = props[prop];
    }
  })
}

function initChildren(fiber, children){
  let preNode = null;
  children.forEach((child, index) => {
    let curNode = {
      type: child.type,
      props: child.props,
      child: null,
      sibling: null,
      parent: fiber,
      dom: null
    }
    if(index === 0){
      fiber.child = curNode;
    }else{
      preNode.sibling = curNode; 
    }
    preNode = curNode;
  })
  
}

let root = null;
function commitRoot(){
  commitWork(root.child);
  root = null;
}

function commitWork(fiber){
  if(!fiber) return;
  let fiberParent = fiber.parent;
  while(!fiberParent.dom){
    fiberParent = fiberParent.parent;
  }
  fiber.dom && fiberParent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateFunctionalComp(fiber){
  let children = [fiber.type(fiber.props)];
  initChildren(fiber, children);

}

function updateOthers(fiber){
  if(!fiber.dom){
    fiber.dom = createDom(fiber.type);
    updateProps(fiber.dom, fiber.props);
  }
  initChildren(fiber, fiber.props.children);

}

function performUnitOfWork(fiber){
  const isFunctionalComp = typeof fiber.type === 'function';
  if(isFunctionalComp){
    updateFunctionalComp(fiber);
  }else{
    updateOthers(fiber);
  }
  
  // return next fiber
  if(fiber.child) return fiber.child;
  // uncle chain
  let curFiber = fiber;
  while(curFiber){
    if(curFiber.sibling) return curFiber.sibling;
    curFiber = curFiber.parent;
  }
}

let nextUnitOfWork = null;

function workLoop(deadline){
  let pause = false;
  while(!pause){
    // run task
    if(nextUnitOfWork) nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    pause = deadline.timeRemaining() < 1;
  }
  // commit all at once
  if(!nextUnitOfWork && root){
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render
}

export default React;