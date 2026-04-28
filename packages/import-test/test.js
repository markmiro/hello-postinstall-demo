import { strictEqual } from "node:assert/strict";
import { greet } from "hello-postinstall";

strictEqual(greet("test"), "Hello, test");
console.log("import-test:", greet("World"));
