import { MESSAGE_THREADS } from "../common/database/database";

export const createThreadId = ({ userAId, userBId }) =>
  userBId < userAId ? `${userBId}/${userAId}` : `${userAId}/${userBId}`;

export const createMessageThreadId = (data) => {
  const threadId = createThreadId(data);
  return `${MESSAGE_THREADS}/` + threadId;
};
