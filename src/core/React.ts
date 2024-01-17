import type { ElementItem, FiberItemType } from '@/type'

export default {
  createElement,
  render,
  update,
}

let nextWorkFiber: FiberItemType | null | undefined = null
let wipRoot: FiberItemType | null = null
let currentRoot: FiberItemType | null = null
function render(el: ElementItem, container: HTMLElement) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
    child: null,
    sibling: null,
    parent: null,
    type: el.type,
    alternate: null,
  }
  nextWorkFiber = wipRoot
}

function update() {
  if (!currentRoot) return
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    type: currentRoot.type,
    child: null,
    sibling: null,
    parent: null,
    alternate: currentRoot,
  }
  nextWorkFiber = wipRoot
}

function workLoop(deadLine: IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkFiber) {
    nextWorkFiber = performUnitOfWork(nextWorkFiber)
    shouldYield = deadLine.timeRemaining() < 1
  }
  if (!nextWorkFiber && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function commitRoot() {
  if (!wipRoot) return
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber: FiberItemType | null) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent?.dom) {
    fiberParent = fiberParent?.parent || null
  }

  if (fiber.effectTag === 'update') {
    if (!fiber.dom) return
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else {
    // 添加dom
    fiber.dom && fiberParent.dom.appendChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function updateFunctionComponent(fiber: FiberItemType) {
  const children = [(fiber.type as Function)(fiber.props)]
  fiber.props.children = children
  reconcileChildren(fiber)
}

function updateNormalComponent(fiber: FiberItemType) {
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = fiber.dom = createDom(fiber.type as string)
    // 2. 设置属性
    updateProps(dom, fiber.props)
  }
  reconcileChildren(fiber)
}

function performUnitOfWork(fiber: FiberItemType) {
  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateNormalComponent(fiber)
  }
  // 返回下一个任务
  if (fiber.child)
    return fiber.child

  let nextFiber: FiberItemType | null = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function createTextNode(text: string | number) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(
  type: string,
  props: ElementItem['props'],
  ...children: Array<ElementItem | string | number>
) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child: any) => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

function createDom(type: string) {
  const dom = type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
  return dom
}

function updateProps(
  dom: HTMLElement | Text,
  newProps: ElementItem['props'],
  oldProps: ElementItem['props'] = { children: [] },
) {
  // 老的有，新的没有 删除
  Object.keys(oldProps).forEach((oldKey) => {
    if (oldKey === 'children') return
    if (!(oldKey in newProps)) {
      (dom as HTMLElement).removeAttribute(oldKey)
    }
  })
  // 老的没有，新的有，增加
  // 老的有， 新的有， 改变
  Object.keys(newProps).forEach((key) => {
    if (key === 'children') return
    if (newProps[key] === oldProps[key]) return
    // 添加绑定事件
    if (key.startsWith('on')) {
      const eventStr = key.substring(2).toLowerCase()
      dom.removeEventListener(eventStr, oldProps[key])
      dom.addEventListener(eventStr, newProps[key])
      return
    }
    (dom as any)[key] = newProps[key]
  })
}
function reconcileChildren(fiber: FiberItemType) {
  let oldFiber = fiber.alternate?.child
  const children = fiber.props.children
  let prevChild: FiberItemType | null = null
  children.forEach((child, index) => {
    const isSameType = child.type === oldFiber?.type
    let newWorkOfUnit: FiberItemType
    if (isSameType) {
      // update
      newWorkOfUnit = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldFiber?.dom || null,
        alternate: oldFiber || null,
        effectTag: 'update',
      }
    } else {
      newWorkOfUnit = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: null,
        alternate: null,
        effectTag: 'placement',
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newWorkOfUnit
    } else {
      if (prevChild) {
        prevChild.sibling = newWorkOfUnit
      }
    }
    prevChild = newWorkOfUnit
  })
}
