import A from './a';
function component() {
  A();
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = ['Hello', 'webpack'].join(' ');

  return element;
}

document.body.appendChild(component());
