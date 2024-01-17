/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:14:57
 * @LastEditTime: 2024-01-17 18:54:51
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
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextUnitOfWork = wipRoot; 
}
// diff dom props
let currentRoot = null;
function update(){
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  }
  nextUnitOfWork = wipRoot;
}

function createDom(type){
  return type === 'TEXT_EL' ? document.createTextNode('') : document.createElement(type);
}


function updateProps(dom, newProps, preProps){
  // old, not new
  Object.keys(preProps).forEach(p => {
    if(p !== 'children'){
      if(!(p in newProps)){
        dom.removeAttribute(p);
      }
    }
  })
  // not old, new
  // old, new
  Object.keys(newProps).forEach(prop => {
    if(prop !== 'children'){
      if(newProps[prop] !== preProps[prop]){
        // console.log(newProps, preProps)
        if(prop.startsWith('on')){
          const typeEvent = prop.slice(2).toLowerCase();
          dom.removeEventListener(typeEvent, preProps[prop]);
          dom.addEventListener(typeEvent, newProps[prop]);
        }else{
          dom[prop] = newProps[prop];
        }
      }
    }
  })
}

function reconcileChildren(fiber, children){
  let oldFiber = fiber.alternate?.child;
  let preNode = null;
  children.forEach((child, index) => {
    let curNode = null;
    // update or create
    const isSameType = oldFiber && oldFiber.type === child.type;
    if(isSameType){
      // update
      curNode = {
        type: child.type,
        props: child.props,
        child: null,
        sibling: null,
        parent: fiber,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update'
      } 
    }else{
      // add new tag
      curNode = {
        type: child.type,
        props: child.props,
        child: null,
        sibling: null,
        parent: fiber,
        dom: null,
        effectTag: 'placement'
      }
    }
    // Do not forget siblings
    if(oldFiber) oldFiber = oldFiber.sibling;
    
    if(index === 0){
      fiber.child = curNode;
    }else{
      preNode.sibling = curNode; 
    }
    preNode = curNode;
  })
  
}

let wipRoot = null;
function commitRoot(){
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber){
  if(!fiber) return;
  let fiberParent = fiber.parent;
  while(!fiberParent.dom){
    fiberParent = fiberParent.parent;
  }

  if(fiber.effectTag === 'update'){
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  }else if(fiber.effectTag === 'placement'){
    fiber.dom && fiberParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function updateFunctionalComp(fiber){
  let children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);

}

function updateOthers(fiber){
  if(!fiber.dom){
    fiber.dom = createDom(fiber.type);
    updateProps(fiber.dom, fiber.props, {});
  }
  reconcileChildren(fiber, fiber.props.children);
  
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
  if(!nextUnitOfWork && wipRoot){
    commitRoot();
  }
  window.requestIdleCallback(workLoop);
}

window.requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
  update
}

export default React;