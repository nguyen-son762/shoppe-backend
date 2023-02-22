export const getEnv = (key: string) => {
  return (process.env[key] as string) || "";
};
