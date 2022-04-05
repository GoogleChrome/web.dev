const supportsFileSystemAccessAPI =
  "getAsFileSystemHandle" in DataTransferItem.prototype;
const supportsWebkitGetAsEntry =
  "webkitGetAsEntry" in DataTransferItem.prototype;

const elem = document.querySelector("main");
const debug = document.querySelector("pre");

elem.addEventListener("dragover", (e) => {
  // Prevent navigation.
  e.preventDefault();
});

elem.addEventListener("dragenter", (e) => {
  elem.style.outline = "solid red 1px";
});

elem.addEventListener("dragleave", (e) => {
  elem.style.outline = "";
});

elem.addEventListener("drop", async (e) => {
  e.preventDefault();
  elem.style.outline = "";
  const fileHandlesPromises = [...e.dataTransfer.items]
    .filter((item) => item.kind === "file")
    .map((item) =>
      supportsFileSystemAccessAPI
        ? item.getAsFileSystemHandle()
        : supportsWebkitGetAsEntry
        ? item.webkitGetAsEntry()
        : item.getAsFile()
    );

  for await (const handle of fileHandlesPromises) {
    if (handle.kind === "directory" || handle.isDirectory) {
      console.log(`Directory: ${handle.name}`);
      debug.textContent += `Directory: ${handle.name}\n`;
    } else {
      console.log(`File: ${handle.name}`);
      debug.textContent += `File: ${handle.name}\n`;
    }
  }
});
