import { createClient } from "redis";

export const client = createClient({
  url: "rediss://red-cg21svg2qv25u2jg5tl0:dWfi5Z1DwfDCh1gpVF2oSkafngVEZWsq@singapore-redis.render.com:6379",
  legacyMode: true,
});
