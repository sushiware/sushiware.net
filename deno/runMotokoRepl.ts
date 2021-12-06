export const setupPlayground = (
  preTags: HTMLCollectionOf<HTMLPreElement>,
  mo: Motoko
) => {
  Array.from(preTags)
    .filter((tag) => {
      const child = tag.firstChild as HTMLElement;

      return (
        child &&
        child.tagName === "CODE" &&
        child.classList.contains("language-motoko")
      );
    })
    .forEach((tag) => {
      tag.classList.add("motoko");

      insertRunButtonAndsetupOutput(tag, extractConfig(tag), mo);
    });
};

type jsonRespose = {
  files: [File];
};

export const addPackage = async (
  name: string,
  repo: string,
  version: string,
  dir: string,
  mo: Motoko
) => {
  const metaUrl = `https://data.jsdelivr.com/v1/package/gh/${repo}@${version}/flat`;
  const baseUrl = `https://cdn.jsdelivr.net/gh/${repo}@${version}`;
  const response = await fetch(metaUrl);
  const json = (await response.json()) as jsonRespose;
  const moFiles = json.files.filter(
    (f) => f.name.startsWith(`/${dir}/`) && /\.mo$/.test(f.name)
  );

  const promises = moFiles.map(async (f) => {
    const content = await (await fetch(baseUrl + f.name)).text();
    const stripped = name + f.name.slice(dir.length + 1);
    mo.saveFile(stripped, content);
  });

  Promise.all(promises).then(() => {
    mo.addPackage(name, name + "/");
    console.log(`Loaded motoko library "${name}"`);
  });
};

const extractConfig = (pre: HTMLPreElement): Config => {
  const div = pre?.parentNode?.parentNode;

  const name = (div as Element).getAttribute("id") + ".mo" || "";

  const classList = Array.from((div as HTMLElement).classList);

  const include = classList
    .filter((c) => c.startsWith("include"))
    .reduce((acc: string[], c: string) => acc.concat(c.split("_")), []);

  const hook =
    classList
      .filter((c) => c.startsWith("hook"))
      .find((c) => c.split("_")[1]) || "";

  return {
    name: name,
    include: include,
    hook: hook,
    isRun: classList.some((c) => c === "run"),
    noRepl: classList.some((c) => c === "no-repl"),
  };
};

const saveIncluded = (mo: Motoko, include: string[]) => {
  return include.reduce((codes: { [key: string]: string }, id: string) => {
    const node = document.getElementById(id);

    const code =
      node
        ?.querySelector("div.content")
        ?.querySelector("pre")
        ?.querySelector("code")?.innerText || "";

    const name = id + ".mo";

    mo.saveFile(name, id);

    codes[name] = code;

    return codes;
  }, {});
};

const insertRunButtonAndsetupOutput = (
  preTag: HTMLPreElement,
  config: Config,
  mo: Motoko
) => {
  if (config.name) {
    mo.saveFile(config.name, (preTag.firstChild as HTMLElement).innerText);
  }

  if (config.noRepl) {
    return;
  }

  const target = document.createElement("div");

  (preTag.parentNode as HTMLElement).insertBefore(target, preTag.nextSibling);

  (target as HTMLElement).classList.add("run-motoko");

  const button = document.createElement("button");
  const output = document.createElement("div");

  (output as HTMLElement).classList.add("listingblock");

  if (config.isRun) {
    output.innerHTML = "<pre>Loading...</pre>";
  }

  button.innerHTML = "<span>Run</span>";
  button.classList.add("run-button");

  target.appendChild(button);
  target.appendChild(output);

  button.addEventListener("click", () => {
    saveIncluded(mo, config.include);

    const code = (preTag.firstChild as HTMLElement).innerText;

    const reader = config.name || "stdin";

    mo.saveFile(reader, code);

    // TODO: config.hookを無視しているので調整する
    const out = mo.run(
      config.include.map((s) => s + ".mo"),
      reader
    );

    output.innerHTML = "";

    if (out.stderr) {
      const pre = document.createElement("pre");

      pre.innerText = out.stderr;
      pre.classList.add("repl-error");

      output.appendChild(pre);
    }

    if (out.stdout) {
      const pre = document.createElement("pre");

      pre.innerText = out.stdout;

      output.appendChild(pre);
    }
  });

  if (config.isRun) {
    button.click();
  }
};

type Config = {
  name: string;
  include: string[];
  hook: string;
  isRun: boolean;
  noRepl: boolean;
};

type Motoko = {
  saveFile: (name: string, code: string) => void;
  run: (files: string[], reader: string) => { stdout: string; stderr: string };
  addPackage: (name: string, path: string) => void;
};
