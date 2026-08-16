import { readFileSync, writeFileSync } from "node:fs";
import variables from "./config.json";

const isTest = process.argv.includes("--test");
const output = isTest ? "tests/README.test.md" : "README.md";

const template = readFileSync("README.template.md", "utf8");

const readme = template.replace(
  /\{\{(\w+)\}\}/g,
  (match, key: string, offset: number, source: string) => {
    const value = variables[key as keyof typeof variables];

    if (
      key === "email" &&
      typeof value === "string" &&
      !source.slice(Math.max(0, offset - 7), offset).endsWith("mailto:")
    ) {
      return value.replace("@", "[at]").replace(".", "[dot]");
    }

    return value ?? match;
  },
);

writeFileSync(output, readme);

console.log(`Built ${output}`);
