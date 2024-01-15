import type { ElementItem, FiberItemType } from '@/type'

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

function render(el: ElementItem, container: HTMLElement) {
  // eslint-disable-next-line ts/no-use-before-define
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

let nextFiber: FiberItemType | null | undefined = null

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
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
    fiber.dom = dom

    // 2. 设置属性
    Object.keys(fiber.props).forEach((key) => {
      if (key === 'children')
        return;
      (dom as any)[key] = fiber.props[key]
    })
    // 3. 添加dom
    fiber.parent && fiber.parent.dom?.appendChild(dom)
  }

  // 4. 创建下一个任务 设置好链表指针
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
    console.log('newWorkOfUnit', newWorkOfUnit)
    if (index === 0) {
      fiber.child = newWorkOfUnit
    } else {
      if (prevChild) {
        prevChild.sibling = newWorkOfUnit
      }
    }
    prevChild = newWorkOfUnit
  })

  // 5. 返回下一个任务
  if (fiber.child)
    return fiber.child
  if (fiber.sibling)
    return fiber.sibling
  return fiber.parent?.sibling
}

export default {
  createElement,
  render,
}
