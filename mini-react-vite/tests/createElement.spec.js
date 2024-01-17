import React from '../core/react';
import {it, describe, expect} from 'vitest';

describe('createElement', () => {
  it('Return virtual DOM with no children', () => {
    const vdom = React.createElement('div', {id: 'test'});

    expect(vdom).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [],
          "id": "test",
        },
        "type": "div",
      }
    `);
  })

  it('Return virtual DOM with children', () => {
    const el = React.createElement('span', null, 'mini');
    const vdom = React.createElement('div', {id: 'test'}, 'hi', el);

    expect(vdom).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_EL",
            },
            {
              "props": {
                "children": [
                  {
                    "props": {
                      "children": [],
                      "nodeValue": "mini",
                    },
                    "type": "TEXT_EL",
                  },
                ],
              },
              "type": "span",
            },
          ],
          "id": "test",
        },
        "type": "div",
      }
    `);
  })
})

