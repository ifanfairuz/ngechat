export const link = (link: string) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return link[0] == "/" ? `${basePath}${link}` : link;
};
