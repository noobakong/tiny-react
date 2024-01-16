import type { ElementItem, FiberItemType } from '@/type'

export default {
  createElement,
  render,
}

let nextFiber: FiberItemType | null | undefined = null
let root: FiberItemType | null = null
function render(el: ElementItem, container: HTMLElement) {
  nextFiber = {
    dom: container,
    props: {
      children: [el],
    },
    child: null,
    sibling: null,
    parent: null,
    type: el.type,
  }
  root = nextFiber
}

function workLoop(deadLine: IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextFiber) {
    nextFiber = performUnitOfWork(nextFiber)
    shouldYield = deadLine.timeRemaining() < 1
  }
  if (!nextFiber && root) {
    commitRoot(root)
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function commitRoot(root: FiberItemType | null) {
  commitWork(root!.child)
  root = null
}

function commitWork(fiber: FiberItemType | null) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent?.dom) {
    fiberParent = fiberParent?.parent || null
  }
  // 添加dom
  fiber.dom && fiberParent.dom.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function updateFunctionComponent(fiber: FiberItemType) {
  const children = [(fiber.type as Function)(fiber.props)]
  fiber.props.children = children
  initChildren(fiber)
}

function updateNormalComponent(fiber: FiberItemType) {
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = fiber.dom = createDom(fiber.type as string)
    // 2. 设置属性
    updateProps(dom, fiber.props)
  }
  initChildren(fiber)
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
  console.log(children, 'children')
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
  console.log(type)
  const dom = type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
  return dom
}

function updateProps(dom: HTMLElement | Text, props: ElementItem['props']) {
  Object.keys(props).forEach((key) => {
    if (key === 'children')
      return;
    (dom as any)[key] = props[key]
  })
}
function initChildren(fiber: FiberItemType) {
  const children = fiber.props.children
  let prevChild: FiberItemType | null = null
  children.forEach((child, index) => {
    const newWorkOfUnit = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
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
