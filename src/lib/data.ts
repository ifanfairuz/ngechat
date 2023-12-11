export const authToPerson = (auth: Auth0User, overides?: Partial<Person>) =>
  ({
    id: auth.email || "",
    name: auth.name || "",
    imageUri: auth.picture || "",
    lastSeen: new Date().toISOString(),
    isOnline: true,
    ...overides,
  } as Person);

export const sessionToPerson = (
  auth?: Auth0Session,
  overides?: Partial<Person>
) => (auth && auth.user ? authToPerson(auth.user, overides) : undefined);

export const statusCanChangeWith: (status: ChatStatus) => ChatStatus[] = (
  status
) => {
  switch (status) {
    case "read":
      return ["send", "sent", "received"];
    case "received":
      return ["send", "sent"];
    case "sent":
      return ["send"];
    case "send":
      return [];
    default:
      return [];
  }
};

export const getInterlocutorIdChat = (
  chat: Chat,
  user?: Auth0User | Person
) => {
  const userid = user ? ("email" in user ? user.email : user.id) : undefined;
  return userid == chat.from.id ? chat.to.id : chat.from.id;
};
