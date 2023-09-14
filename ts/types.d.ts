interface Value {
  [key: string]: number;
}

interface Dragged {
  el:  Node | null,
  class: string | null,
  index: number | null,
}

export { Value, Dragged };