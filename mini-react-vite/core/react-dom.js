/*
 * @Author: Ada J
 * @Date: 2024-01-16 21:14:34
 * @LastEditTime: 2024-01-16 21:17:23
 * @Description: 
 */
import React from './react.js';

const ReactDom = {
  createRoot: (root) => {
    return {
      render: (app) => React.render(root, app)
    }
  }
}

export default ReactDom;