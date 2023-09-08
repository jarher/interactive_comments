import { appendElements } from "./utils.js";

function addComment(placeholderTxt, user, index) {
  const elements = [
    {
      element: "div",
      attributes: { name: "class", value: "addComment" },

      children: [
        {
          element: textArea(placeholderTxt),
        },
        {
          element: "img",
          attributes: { name: "src", value: user.image.png },
        },
        {
          element: "button",
          text: "SEND",
          attributes: [
            { name: "class", value: "btn sendCommentBtn" },
            { name: "id", value: "sendCommentBtn" },
            { name: "data-id", value: index },
            { name: "disabled", value: "" },
          ],
        },
      ],
    },
  ];
  return appendElements(elements);
}
function textArea(placeHolderText) {
  let object;
  if (placeHolderText === "Add a Reply") {
    object = {
      element: "div",
      attributes: {
        name: "class",
        value: "addText",
      },
      children: [
        {
          element: "span",
          attributes: [
            { name: "id", value: "textReply" },
            { name: "contenteditable", value: true },
          ],
        },
      ],
    };
  } else {
    object = {
      element: "textarea",
      attributes: [
        {
          name: "class",
          value: "addText",
        },
        {
          name: "cols",
          value: "30",
        },
        {
          name: "rows",
          value: "3",
        },
        {
          name: "placeholder",
          value: placeHolderText,
        },
      ],
    };
  }
  const element = [object];
  return appendElements(element);
}

export { addComment };
