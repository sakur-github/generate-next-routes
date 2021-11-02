const util = require("util");
const fs = require("fs");
const path = require("path");

function fileToName(filename) {
  const str = path.basename(filename);
  return str
    .replace(new RegExp(".js", "g"), "")
    .replace(new RegExp("\\[", "g"), "")
    .replace(new RegExp("\\]", "g"), "")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replace(new RegExp("-", "g"), "")
    .replace("index", "home");
}

const generateRoutes = (
  pagesFolder = "./pages",
  generatedFileName = "./routes.js"
) => {
  function dirTree(filename) {
    var stats = fs.lstatSync(filename),
      info = {
        [fileToName(filename)]: {},
      };
    const key = fileToName(filename);
    if (stats.isDirectory()) {
      const children = fs.readdirSync(filename).map(function (child) {
        const childTree = dirTree(filename + "/" + child);
        return childTree;
      });
      info[key] = children;
    } else {
      const pathname = filename.replace(pagesFolder, "");
      const route = pathname
        .replace(pagesFolder, "")
        .replace(".js", "")
        .replace("/index", "")
        .replace(new RegExp("\\[", "g"), "${")
        .replace(new RegExp("\\]", "g"), "}");
      const containsVariables = route.includes("${");
      if (containsVariables) {
        const params = pathname
          .split("[")
          .toString()
          .split("]")
          .filter((param) => {
            if (param.includes("/,")) {
              return param;
            }
          })
          .map((param) => {
            return param.replace(".js", "").replace("/", "").split(",").pop();
          });
        info[key] = {
          getRoute: `FUNCTION(${params.toString()}) => \`${route}}FUNCTION`,
        };
      } else {
        info[key] = route;
      }
    }

    return info;
  }

  const tree = dirTree(pagesFolder);

  const walkPages = (pagesArray) => {
    const pagesObject = {};
    pagesArray.forEach((page) => {
      const key = Object.keys(page)[0];
      const value = Object.values(page)[0];
      if (typeof value === "string" || !value.length) {
        pagesObject[key] = value;
      } else {
        pagesObject[key] = walkPages(value);
      }
    });
    return pagesObject;
  };

  const pages = walkPages(tree.pages);

  delete pages.api;

  const printFile =
    "export const routes = " +
    util
      .inspect(pages, { depth: null })
      .toString()
      .replace(new RegExp("'FUNCTION", "g"), "")
      .replace(new RegExp("FUNCTION'", "g"), "`");

  fs.writeFile(generatedFileName, printFile, (err) => {
    if (err) {
      throw new Error(err);
    }
  });
};

generateRoutes("./pages", "./routes.js");
