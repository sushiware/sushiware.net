const setupPlayground1 = (preTags, mo)=>{
    Array.from(preTags).filter((tag)=>{
        const child = tag.firstChild;
        return child && child.tagName === "CODE" && child.classList.contains("language-motoko");
    }).forEach((tag)=>{
        tag.classList.add("motoko");
        insertRunButtonAndsetupOutput(tag, extractConfig(tag), mo);
    });
};
const addPackage1 = async (name, repo, version, dir, mo)=>{
    const metaUrl = `https://data.jsdelivr.com/v1/package/gh/${repo}@${version}/flat`;
    const metadata = await (await fetch(metaUrl)).json();
    const moFiles = metadata.files.filter((f)=>f.name.startsWith(`/${dir}/`) && /\.mo$/.test(f.name)
    );
    const baseUrl = `https://cdn.jsdelivr.net/gh/${repo}@${version}`;
    const saveFiles = moFiles.map(async (f)=>{
        const content = await (await fetch(baseUrl + f.name)).text();
        const stripped = name + f.name.slice(dir.length + 1);
        mo.saveFile(stripped, content);
    });
    Promise.all(saveFiles).then(()=>{
        mo.addPackage(name, name + "/");
        console.log(`Loaded motoko library "${name}"`);
    });
};
const extractConfig = (pre)=>{
    const div = pre?.parentNode?.parentNode;
    const name = (div.getAttribute("id") || "tmp") + ".mo" || "";
    const classList = Array.from(div.classList);
    const include = classList.filter((c)=>c.startsWith("include")
    ).reduce((acc, c)=>acc.concat(c.split("_"))
    , []);
    const hook = classList.filter((c)=>c.startsWith("hook")
    ).find((c)=>c.split("_")[1]
    ) || "";
    return {
        name: name,
        include: include,
        hook: hook,
        isRun: classList.some((c)=>c === "run"
        ),
        noRepl: classList.some((c)=>c === "no-repl"
        )
    };
};
const saveIncluded = (mo, include)=>{
    return include.reduce((codes, id)=>{
        const node = document.getElementById(id);
        const code = node?.querySelector("div.content")?.querySelector("pre")?.querySelector("code")?.innerText || "";
        const name = id + ".mo";
        mo.saveFile(name, code);
        codes[name] = code;
        return codes;
    }, {
    });
};
const insertRunButtonAndsetupOutput = (preTag, config, mo)=>{
    if (config.name) {
        mo.saveFile(config.name, preTag.firstChild.innerText);
    }
    if (config.noRepl) {
        return;
    }
    const target = document.createElement("div");
    preTag.parentNode.insertBefore(target, preTag.nextSibling);
    target.classList.add("run-motoko");
    const button = document.createElement("button");
    button.innerHTML = "<span>Run</span>";
    button.classList.add("run-button");
    target.appendChild(button);
    const output = document.createElement("div");
    output.classList.add("listingblock");
    if (config.isRun) {
        output.innerHTML = "<pre>Loading...</pre>";
    }
    target.appendChild(output);
    button.addEventListener("click", ()=>{
        saveIncluded(mo, config.include);
        const code = preTag.firstChild.innerText;
        const reader = config.name || "stdin";
        mo.saveFile(reader, code);
        const out = mo.run(config.include.map((s)=>s + ".mo"
        ), reader);
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
export { setupPlayground1 as setupPlayground };
export { addPackage1 as addPackage };
