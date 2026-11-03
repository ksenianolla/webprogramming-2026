export function createElement(tag, options = {}, children = []) {
  const { className, text, attrs = {}, dataset = {}, on = {} } = options;
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) {
      continue;
    }
    element.setAttribute(name, value === true ? '' : String(value));
  }
  Object.assign(element.dataset, dataset);
  for (const [type, handler] of Object.entries(on)) {
    element.addEventListener(type, handler);
  }
  element.append(...children.filter(Boolean));

  return element;
}

export function requireElement(selector, root = document) {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}
