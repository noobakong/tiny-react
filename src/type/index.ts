export interface ElementItem {
  type: string
  props: {
    children: ElementItem[]
    [key: string]: any
  }
}

export interface FiberItemType {
  dom: HTMLElement | Text | null
  props: {
    [key: string]: any
    children: ElementItem[]
  }
  child: FiberItemType | null
  sibling: FiberItemType | null
  parent: FiberItemType | null
  type: string | Function
}
