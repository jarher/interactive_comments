import { readData } from "./crud.js";
const response = readData();
console.log(response)
const currentUser = response.currentUser;
const comments = response.comments;

function createElement(data) {
  const elementHtml = document.createElement(data.element);
  if (data.text !== "") {
    elementHtml.textContent = data.text;
  }
  if (data.attributes) {
    if (Array.isArray(data.attributes)) {
      data.attributes.forEach((attr) => {
        elementHtml.setAttribute(attr.name, attr.value);
      });
    } else {
      elementHtml.setAttribute(data.attributes.name, data.attributes.value);
    }
  }
  return elementHtml;
}
function appendElements(elements) {
  let parentHTML;
  for (let parent of elements) {
    parentHTML =
      typeof parent.element === "string"
        ? createElement(parent)
        : parent.element;
    if (parent.children) {
      const childrenHTML = parent.children.map((children) =>
        typeof children.element === "string"
          ? createElement(children)
          : children.element
      );
      childrenHTML.forEach((element) => {
        parentHTML.append(element);
      });
    }
  }
  return parentHTML;
}
function createIconButton(class_name, iconText, id) {
  const content = id
    ? [
        { name: "class", value: `btn ${class_name}` },
        { name: "data-id", value: id },
      ]
    : { name: "class", value: `btn ${class_name}` };

  const elements = [
    {
      element: "button",
      attributes: content,
      children: [
        {
          element: "span",
          text: iconText,
          attributes: { name: "class", value: "material-symbols-rounded" },
        },
      ],
    },
  ];
  return appendElements(elements);
}
function createReplyButton(userId) {
  const elements = [
    {
      element: createIconButton("replyBtn", "reply"),
      children: [
        {
          element: "span",
          text: "reply",
          attributes: [
            { name: "data-id", value: userId },
            { name: "id", value: "replyComment" },
          ],
        },
      ],
    },
  ];
  return appendElements(elements);
}
function createScore(scoreValue, id) {
  const elements = [
    {
      element: "div",
      attributes: { name: "class", value: "score" },
      children: [
        {
          element: appendElements([
            {
              element: "button",
              attributes: [{ name: "class", value: "btn scoreBtn" }],
              children: [
                {
                  element: "span",
                  text: "add",
                  attributes: [
                    {
                      name: "class",
                      value: "material-symbols-rounded",
                    },
                    { name: "id", value: "scorePlus" },
                    { name: "data-id", value: id },
                  ],
                },
              ],
            },
          ]),
        },
        {
          element: "span",
          text: scoreValue,
          attributes: { name: "class", value: "scoreValue" },
        },
        {
          element: appendElements([
            {
              element: "button",
              attributes: [{ name: "class", value: "btn scoreBtn" }],
              children: [
                {
                  element: "span",
                  text: "remove",
                  attributes: [
                    {
                      name: "class",
                      value: "material-symbols-rounded",
                    },
                    { name: "id", value: "scoreMinus" },
                    { name: "data-id", value: id },
                  ],
                },
              ],
            },
          ]),
        },
      ],
    },
  ];
  return appendElements(elements);
}
function editReply(id) {
  const elements = [
    {
      element: "div",
      attributes: { name: "class", value: "editReply" },
      children: [
        {
          element: appendElements([
            {
              element: createIconButton("replyDelete", "delete", id),
              children: [
                {
                  element: "span",
                  text: "delete",
                },
              ],
            },
          ]),
        },
        {
          element: appendElements([
            {
              element: createIconButton("replyEdit", "edit", id),
              children: [
                {
                  element: "span",
                  text: "edit",
                },
              ],
            },
          ]),
        },
      ],
    },
  ];

  return appendElements(elements);
}
function findMaxId(data) {
  let id_values = [];
  Array.from(data).forEach((elem) => {
    id_values.push(elem.id);
    elem.replies.forEach((reply) => {
      if (reply.id) {
        id_values.push(reply.id);
      }
    });
  });
  return Math.max(...id_values);
}
export {
  createElement,
  createReplyButton,
  editReply,
  createScore,
  createIconButton,
  comments,
  currentUser,
  appendElements,
  response,
  findMaxId,
};
