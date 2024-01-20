/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:14:57
 * @LastEditTime: 2024-01-20 15:50:27
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
let wipFiber = null;
function update(){
  let currentFiber = wipFiber;
  return () => {
    // console.log({currentFiber})
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot;
    
  }
}

let stateHooks;
let stateHooksIndex = 0;
function useState(initial){
  let currentFiber = wipFiber;
  let oldHook = currentFiber?.alternate?.stateHooks;
  const stateHook = {
    state: oldHook ? oldHook[stateHooksIndex].state : initial,
    queue: oldHook ? oldHook[stateHooksIndex].queue : []
  }
  stateHook.queue.forEach(action => {
    stateHook.state = action(stateHook.state);
    
  })
  stateHook.queue = [];
 
  stateHooks.push(stateHook);
  currentFiber.stateHooks = stateHooks;
  stateHooksIndex++;
  
  function setState(action){
    let eagerState = typeof action === 'function' ? action(stateHook.state) : action;
    if(eagerState === stateHook.state) return;

    const ac = typeof action === 'function' ? action : () => action;
    stateHook.queue.push(ac);
    
    // update view
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot;

  }
  return [stateHook.state, setState];
}

let effectHooks;
function useEffect(callback, deps){
  const effectHook = {
    callback,
    deps,
    cleanup: undefined
  }

  effectHooks.push(effectHook);
  wipFiber.effectHooks = effectHooks;
  
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
      // update props
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
      // add new tag and delete old one
      curNode = {
        type: child.type,
        props: child.props,
        child: null,
        sibling: null,
        parent: fiber,
        dom: null,
        effectTag: 'placement'
      }
      // delete old one
      if(oldFiber) deleteCollection.push(oldFiber);
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

  //delete other old nodes
  while(oldFiber){
    deleteCollection.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
  
}

let wipRoot = null;
let deleteCollection = [];
function commitRoot(){
  // delete all old nodes at once
  deleteCollection.forEach(deleteCommit);
  commitWork(wipRoot.child);
  // call useEffect callbacks
  commitEffectHooks();
  
  wipRoot = null;
  deleteCollection = [];
}

function commitEffectHooks(){
  function run(fiber){
    if(!fiber) return;
    let effectHooks = fiber?.effectHooks;
    let oldEffectHooks = fiber?.alternate?.effectHooks;
    if(!oldEffectHooks){
      // init execute anyway
      effectHooks?.forEach(effectHook => {
        effectHook.cleanup = effectHook.callback();
      })
    }else{
      // update only when dep changed
      effectHooks.forEach((newEffectHook, index) => {
        if(newEffectHook.deps.length){
          const oldDeps = oldEffectHooks[index].deps;
          const needUpdate = oldDeps.some((oldDep, idx) => oldDep !== newEffectHook.deps[idx]);
          needUpdate && (newEffectHook.cleanup = newEffectHook.callback());
        }
      })
    }

    run(fiber.child);
    run(fiber.sibling);
  }
  function invokeCleanup(fiber){
    if(!fiber) return;
    let oldEffectHooks = fiber?.alternate?.effectHooks;
    // cleanup
    oldEffectHooks?.forEach(oldEH => {
      if(oldEH.deps.length > 0){
        oldEH.cleanup && oldEH.cleanup();
      }
    })

    invokeCleanup(fiber.child);
    invokeCleanup(fiber.sibling);
  }
  // invoke cleanups
  invokeCleanup(wipRoot);
  // invoke effect
  run(wipRoot);
}

function deleteCommit(fiber){
  if(fiber.dom){
    let fiberParent = fiber.parent;
    while(!fiberParent.dom){
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);

  }else{
    deleteCommit(fiber.child);
  }
}

function commitWork(fiber){
  // console.log({fiber})
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
  stateHooks = [];
  stateHooksIndex = 0;
  effectHooks = [];

  wipFiber = fiber;
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
  // console.log({fiber})
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
    // console.log(nextUnitOfWork)
    if(nextUnitOfWork === wipRoot?.sibling){
      nextUnitOfWork = null;
    }
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
  useState,
  update,
  useEffect
}

export default React;