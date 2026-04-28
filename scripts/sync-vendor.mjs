import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const mappings = [
    {
        type: "file",
        from: "node_modules/jquery/dist/jquery.min.js",
        to: "assets/vendor/jquery/jquery.min.js"
    },
    {
        type: "file",
        from: "node_modules/jquery/dist/jquery.min.map",
        to: "assets/vendor/jquery/jquery.min.map"
    },
    {
        type: "dir",
        from: "node_modules/bootstrap/dist/css",
        to: "assets/vendor/bootstrap/css"
    },
    {
        type: "dir",
        from: "node_modules/bootstrap/dist/js",
        to: "assets/vendor/bootstrap/js"
    },
    {
        type: "file",
        from: "node_modules/icofont/dist/icofont.min.css",
        to: "assets/vendor/icofont/icofont.min.css"
    },
    {
        type: "file",
        from: "node_modules/icofont/dist/fonts/icofont.woff",
        to: "assets/vendor/icofont/fonts/icofont.woff"
    },
    {
        type: "file",
        from: "node_modules/icofont/dist/fonts/icofont.woff2",
        to: "assets/vendor/icofont/fonts/icofont.woff2"
    },
    {
        type: "file",
        from: "node_modules/boxicons/css/boxicons.css",
        to: "assets/vendor/boxicons/css/boxicons.css"
    },
    {
        type: "dir",
        from: "node_modules/boxicons/fonts",
        to: "assets/vendor/boxicons/fonts"
    },
    {
        type: "file",
        from: "node_modules/animate.css/animate.css",
        to: "assets/vendor/animate.css/animate.css"
    },
    {
        type: "file",
        from: "node_modules/animate.css/animate.min.css",
        to: "assets/vendor/animate.css/animate.min.css"
    },
    {
        type: "file",
        from: "node_modules/venobox/venobox/venobox.css",
        to: "assets/vendor/venobox/venobox.css"
    },
    {
        type: "file",
        from: "node_modules/venobox/venobox/venobox.js",
        to: "assets/vendor/venobox/venobox.js"
    },
    {
        type: "file",
        from: "node_modules/venobox/venobox/venobox.min.js",
        to: "assets/vendor/venobox/venobox.min.js"
    },
    {
        type: "file",
        from: "node_modules/aos/dist/aos.css",
        to: "assets/vendor/aos/aos.css"
    },
    {
        type: "file",
        from: "node_modules/aos/dist/aos.js",
        to: "assets/vendor/aos/aos.js"
    },
    {
        type: "file",
        from: "node_modules/jquery.easing/jquery.easing.min.js",
        to: "assets/vendor/jquery.easing/jquery.easing.min.js"
    },
    {
        type: "file",
        from: "node_modules/jquery-sticky/jquery.sticky.js",
        to: "assets/vendor/jquery-sticky/jquery.sticky.js"
    },
    {
        type: "file",
        from: "node_modules/waypoints/lib/jquery.waypoints.min.js",
        to: "assets/vendor/waypoints/jquery.waypoints.min.js"
    },
    {
        type: "file",
        from: "node_modules/jquery.counterup/jquery.counterup.min.js",
        to: "assets/vendor/counterup/counterup.min.js"
    },
    {
        type: "file",
        from: "node_modules/isotope-layout/dist/isotope.pkgd.js",
        to: "assets/vendor/isotope-layout/isotope.pkgd.js"
    },
    {
        type: "file",
        from: "node_modules/isotope-layout/dist/isotope.pkgd.min.js",
        to: "assets/vendor/isotope-layout/isotope.pkgd.min.js"
    },
    {
        type: "file",
        from: "node_modules/bootstrap-icons/font/bootstrap-icons.css",
        to: "assets/vendor/bootstrap-icons/bootstrap-icons.css"
    },
    {
        type: "dir",
        from: "node_modules/bootstrap-icons/font/fonts",
        to: "assets/vendor/bootstrap-icons/fonts"
    },
    {
        type: "file",
        from: "node_modules/htmx.org/dist/htmx.min.js",
        to: "assets/vendor/htmx/htmx.min.js"
    },
    {
        type: "file",
        from: "node_modules/htmx.org/dist/ext/json-enc.js",
        to: "assets/vendor/htmx/ext/json-enc.js"
    },
    {
        type: "file",
        from: "node_modules/alpinejs/dist/cdn.min.js",
        to: "assets/vendor/alpinejs/cdn.min.js"
    }
];

function fullPath(relativePath) {
    return path.join(root, relativePath);
}

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function assertSource(relativePath, expectedType) {
    const source = fullPath(relativePath);

    if (!fs.existsSync(source)) {
        throw new Error(`Source ${expectedType} does not exist: ${relativePath}`);
    }

    const stat = fs.statSync(source);

    if (expectedType === "file" && !stat.isFile()) {
        throw new Error(`Source is not a file: ${relativePath}`);
    }

    if (expectedType === "directory" && !stat.isDirectory()) {
        throw new Error(`Source is not a directory: ${relativePath}`);
    }
}

function copyFile(relativeFrom, relativeTo) {
    assertSource(relativeFrom, "file");

    const from = fullPath(relativeFrom);
    const to = fullPath(relativeTo);

    ensureDir(path.dirname(to));
    fs.copyFileSync(from, to);
    fs.chmodSync(to, 0o644);
    console.log(`Copied file: ${relativeFrom} -> ${relativeTo}`);
}

function copyDirContents(from, to) {
    ensureDir(to);

    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        const sourceEntry = path.join(from, entry.name);
        const targetEntry = path.join(to, entry.name);

        if (entry.isDirectory()) {
            copyDirContents(sourceEntry, targetEntry);
        } else if (entry.isFile()) {
            ensureDir(path.dirname(targetEntry));
            fs.copyFileSync(sourceEntry, targetEntry);
        }
    }
}

function copyDir(relativeFrom, relativeTo) {
    assertSource(relativeFrom, "directory");

    const from = fullPath(relativeFrom);
    const to = fullPath(relativeTo);

    fs.rmSync(to, { recursive: true, force: true });
    copyDirContents(from, to);
    console.log(`Copied directory: ${relativeFrom} -> ${relativeTo}`);
}

for (const mapping of mappings) {
    if (mapping.type === "file") {
        copyFile(mapping.from, mapping.to);
    } else if (mapping.type === "dir") {
        copyDir(mapping.from, mapping.to);
    } else {
        throw new Error(`Unsupported mapping type: ${mapping.type}`);
    }
}
