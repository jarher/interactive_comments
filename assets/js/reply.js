import { createComment } from "./comment.js";
import { createElement } from "./utils.js";

function replies_content(data) {
  const { replies } = data;
  const replies_container = createElement({
    element: "div",
    attributes: { name: "class", value: "replies" },
  });
  const user_container = createElement({
    element: "div",
    attributes: { name: "class", value: "user" },
  });

  replies.forEach((element) => {
    element.content = element.content.replace(/@\w+:/,'');
    element.content = `@${element.replyingTo}: ${element.content}`
    user_container.append(createComment(element));
  });
  replies_container.append(user_container);
  return replies_container;
}

export { replies_content };
