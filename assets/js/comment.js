import {
  createReplyButton,
  createScore,
  editReply,
  appendElements,
  currentUser,
} from "./utils.js";

function formatDate(createdAt) {
  if (typeof createdAt === "string") {
    return createdAt;
  } else {
    const currentDate = new Date(Date.now());
    const commentDate = new Date(createdAt);
    const year = currentDate.getFullYear() - commentDate.getFullYear();
    const month = currentDate.getMonth() - commentDate.getMonth();
    const day = currentDate.getDay() - commentDate.getDay();
    const hours = currentDate.getHours() - commentDate.getHours();
    const minutes = currentDate.getMinutes() - commentDate.getMinutes();
    const seconds = currentDate.getSeconds() - commentDate.getSeconds();

    if (year > 0) return year > 1 ? "years ago" : "year ago";

    if (month > 0) return month > 1 ? "Months ago" : "A Month ago";

    if (day > 0) {
      if (day >= 7) return day > 1 ? `${day} days ago` : `A day ago`;

      if (day >= 8 && day <= 14) return "2 weeks ago";

      if (day >= 15 && day <= 21) return "3 weeks ago";

      return "4 weeks ago";
    }
    if (hours > 0) return hours > 1 ? `${hours} hours ago` : `A hour ago`;

    if (minutes > 0)
      return minutes > 1 ? `${minutes} minutes ago` : `A minute ago`;

    return seconds > 1 ? `${seconds} seconds ago` : `A second ago`;
  }
}
function createCommentHeader(user, createdAt) {
  const elements = [
    {
      element: "div",
      attributes: { name: "class", value: "commentHeader" },
      children: [
        {
          element: "img",
          attributes: { name: "src", value: user.image.png },
        },
        {
          element: "span",
          text: user.username,
          attributes: { name: "class", value: "userName" },
        },
        {
          element: "span",
          text: formatDate(createdAt),
          attributes: { name: "class", value: "commentTimestamp" },
        },
      ],
    },
  ];
  return appendElements(elements);
}
function createComment({ id, content, createdAt, score, user }) {

  const elements = [
    {
      element: "div",
      attributes: [
        { name: "class", value: "comment" },
        { name: "data-id", value: id },
      ],
      children: [
        {
          element: createCommentHeader(user, createdAt),
        },
        {
          element: appendElements([
            {
              element: "div",
              attributes: { name: "class", value: "editTextWrapper" },
              children: [
                {
                  element: "p",
                  text: content,
                  attributes: { name: "class", value: "commentText" },
                },
              ],
            },
          ]),
        },
        {
          element: createScore(score, id),
        },
      ],
    },
  ];

  const comment = appendElements(elements);

  user.username === currentUser.username
    ? comment.append(editReply(id))
    : comment.append(createReplyButton(id));
  return comment;
}

export { createComment, formatDate };
