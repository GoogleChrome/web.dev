import {assert} from "./test/assert";
import {normalizeUrl} from "./urls";

suite("urls", () => {
  test("normalizeUrl", () => {
    assert(normalizeUrl("/foo?") == "/foo/", "search should be ignored");
    assert(
      normalizeUrl("/foo?bar/index.html") == "/foo/?bar/index.html",
      "search should be ignored if it has index.html",
    );
    assert(normalizeUrl("/foo") == "/foo/", "requries trailing slash");
    assert(
      normalizeUrl("/zing/test/index.html") == "/zing/test/",
      "removes index.html",
    );
    assert(
      normalizeUrl("/test/hello.html") == "/test/hello.html",
      "ignores non-index.html HTML pages",
    );
  });
});
