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
  const dom
    = el.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(el.type)
  console.log(dom, 'dom')
  Object.keys(el.props).forEach((key) => {
    if (key === 'children')
      return;
    // dom[key] = el.props[key];
    (dom as any)[key] = el.props[key]
  })

  el.props.children.forEach((child) => {
    render(child, dom as HTMLElement)
  })

  container.append(dom)
}

export default {
  createElement,
  render,
}

export interface ElementItem {
  type: string
  props: {
    children: ElementItem[]
    [key: string]: any
  }
}
