import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, ARCJET_ENV, NODE_ENV } from "../config/env.js"; // Make sure NODE_ENV is imported

if (!ARCJET_KEY) {
  throw new Error("Arcjet key is missing!");
}

export const aj = arcjet({
  key: ARCJET_KEY,
  environment: ARCJET_ENV || "development",
  characteristics: ["ip.src"],
  rules: [
    shield({
      // CORRECTED: Use "DRY_RUN" instead of "SIMULATE"
      mode: NODE_ENV === "production" ? "LIVE" : "DRY_RUN"
    }),
    // ######The detectBot is desibled beacsue i have tried many times and now its showing bot detected when every aim making anyrequest .
    // detectBot({
    //   mode: "LIVE",
    //   allow: [
    //     "CATEGORY:SEARCH_ENGINE",
    //     "BROWSER:CHROME",
    //     "BROWSER:FIREFOX",
    //     "BROWSER:SAFARI"
    //   ]
    // }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ]
});