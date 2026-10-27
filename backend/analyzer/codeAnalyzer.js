const acorn = require("acorn");

function analyzeCode(code) {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Source code cannot be empty");
  }

  const ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  });

  const functions = [];
  const classes = [];
  const imports = [];

  for (const node of ast.body) {
    if (node.type === "FunctionDeclaration") {
      functions.push(node.id?.name || "anonymous");
    }

    if (node.type === "ClassDeclaration") {
      classes.push(node.id?.name || "anonymous");
    }

    if (node.type === "ImportDeclaration") {
      imports.push(node.source.value);
    }

    if (node.type === "VariableDeclaration") {
      for (const declaration of node.declarations) {
        if (
          declaration.init &&
          ["ArrowFunctionExpression",
           "FunctionExpression"].includes(declaration.init.type)
        ) {
          functions.push(declaration.id.name || "anonymous");
        }
      }
    }
  }

  return {
    language: "JavaScript",
    totalLines: code.split(/\r?\n/).length,
    functions,
    classes,
    imports
  };
}

module.exports = { analyzeCode };