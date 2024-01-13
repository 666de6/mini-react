/*
 * @Author: Ada J
 * @Date: 2024-01-13 22:00:40
 * @LastEditTime: 2024-01-13 22:45:47
 * @Description: 
 */
import React from "./react.js";
const ReactDom = {
  createRoot: (root) => {
    return {
      render: (app) => {
        React.render(root, app);
      }
    }
  }
}

export default ReactDom;
