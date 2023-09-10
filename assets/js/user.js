import { addComment } from "./addComment.js";
import { createComment } from "./comment.js";
import { readData } from "./crud.js";
import { replies_content } from "./reply.js";
import { appendElements, comments, currentUser, findMaxId } from "./utils.js";

function getUser(param) {
  let data = readData();

  for (let index in data.comments) {
    if (
      data.comments[index].id ===
      (typeof param === "object"
        ? Number.parseInt(param.target.dataset.id)
        : param)
    ) {
      return {
        user_data: data.comments[index],
        index,
        data,
      };
    }
  }
  for (let index_data in data.comments) {
    for (let index_replies in data.comments[index_data].replies) {
      if (
        data.comments[index_data].replies[index_replies].id ===
        Number.parseInt(
          typeof param === "object" ? param.target.dataset.id : param
        )
      ) {
        return {
          user_data: data.comments[index_data].replies[index_replies],
          index: index_data,
          data,
        };
      }
    }
  }
}

function createUser(data) {
  const { id } = data;
  const elements = [
    {
      element: "div",
      attributes: [
        { name: "class", value: "user" },
        { name: "data-id", value: id },
      ],
      children: [
        {
          element: createComment(data),
        },
        {
          element: replies_content(data),
        },
      ],
    },
  ];

  return appendElements(elements);
}

function createUserInput() {
  const elements = [
    {
      element: "div",
      attributes: { name: "class", value: "currentUser" },
      children: [
        {
          element: addComment(
            "Add a comment",
            currentUser,
            findMaxId(comments) + 1
          ),
        },
      ],
    },
  ];
  return appendElements(elements);
}
export { createUser, createUserInput, getUser };
