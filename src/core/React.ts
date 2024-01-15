import type { ElementItem, FiberItemType } from '@/type'

export default {
  createElement,
  render,
}

let nextFiber: FiberItemType | null | undefined = null
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
}

function workLoop(deadLine: IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextFiber) {
    nextFiber = performUnitOfWork(nextFiber)
    shouldYield = deadLine.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber: FiberItemType) {
  // debugger
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = fiber.dom = createDom(fiber.type)
    // 2. 设置属性
    updateProps(dom, fiber.props)
    // 3. 添加dom
    fiber.parent && fiber.parent.dom?.appendChild(dom)
  }
  // 4. 创建下一个任务 设置好链表指针
  initChildren(fiber)
  // 5. 返回下一个任务
  if (fiber.child)
    return fiber.child
  if (fiber.sibling)
    return fiber.sibling
  return fiber.parent?.sibling
}

function createTextNode(text: string) {
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
  ...children: ElementItem['props']['children'] | string[]
) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child: any) => {
        return typeof child === 'string' ? createTextNode(child) : child
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
