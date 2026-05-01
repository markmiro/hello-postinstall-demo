import { strictEqual } from "node:assert/strict";
import { greet } from "import-test";

strictEqual(greet("test"), "Hello, test");
console.log("import-test-transitive:", greet("World"));
