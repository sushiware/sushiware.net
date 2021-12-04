function changeCodeBlock() {
  var preTags = document.getElementsByTagName("pre");
  for (var i = 0; i < preTags.length; i++) {
    var preTag = preTags[i];
    var firstChild = preTag.firstChild;
    if (firstChild && firstChild.tagName === "CODE") {
      if (firstChild.classList.contains("language-motoko")) {
        preTag.classList.add("motoko");
        var config = extractConfig(preTag);
        appendRun(preTag, config);
      }
    }
  }
}

function extractConfig(pre) {
  var div = pre.parentNode.parentNode;
  var name = div.getAttribute("id");
  if (name) {
    name += ".mo";
  }
  var include = [];
  var hook = null;
  for (var i = 0; i < div.classList.length; i++) {
    var config = div.classList[i];
    if (config.startsWith("include")) {
      var split = config.split("_");
      for (var j = 1; j < split.length; j++) {
        include.push(split[j]);
      }
    } else if (config.startsWith("hook")) {
      var split = config.split("_");
      hook = split[1];
    }
  }

  return {
    name: name,
    include: include,
    hook: hook,
    isRun: div.classList.contains("run"),
    noRepl: div.classList.contains("no-repl"),
  };
}

function saveIncluded(include) {
  var codes = {};
  for (var i = 0; i < include.length; i++) {
    var node = document.getElementById(include[i]);
    var codeTag = node
      .querySelector("div.content")
      .querySelector("pre")
      .querySelector("code");
    var code = codeTag.innerText;
    var name = include[i] + ".mo";
    Motoko.saveFile(name, code);
    codes[name] = code;
  }
  return codes;
}

function appendRun(element, config) {
  if (config.name) {
    Motoko.saveFile(config.name, element.firstChild.innerText);
  }

  if (config.noRepl) {
    return;
  }

  var target = document.createElement("div");
  element.parentNode.insertBefore(target, element.nextSibling);

  target.classList = "run-motoko";

  var button = document.createElement("button");
  var output = document.createElement("div");

  output.classList = "listingblock";
  if (config.isRun) {
    output.innerHTML = "<pre>Loading...</pre>";
  }

  button.innerHTML = "<span>Run</span>";
  button.classList = "run-button";

  target.appendChild(button);
  target.appendChild(output);

  button.addEventListener("click", function () {
    var codes = saveIncluded(config.include);
    var code = element.firstChild.innerText;

    var file = config.name || "stdin";

    Motoko.saveFile(file, code);

    var out;
    if (config.hook) {
      var fn = window[config.hook];
      if (typeof fn !== "function") {
        throw new Error(config.hook + " is not a function");
      }
      out = fn.apply(null, [codes, code]);
    } else {
      var list = config.include.map(function (s) {
        return s + ".mo";
      });
      out = Motoko.run(list, file);
    }

    output.innerHTML = "";

    if (out.stderr) {
      var pre = document.createElement("pre");
      pre.innerText = out.stderr;
      pre.classList.add("repl-error");
      output.appendChild(pre);
    }

    if (out.stdout) {
      var pre = document.createElement("pre");
      pre.innerText = out.stdout;
      output.appendChild(pre);
    }
  });

  if (config.isRun) {
    button.click();
  }
}
