import index from "./src/index.html";
import path from "path";

Bun.serve({
    routes: {
        "/": index,
        "/*": index,
        "/public/*": {
            GET: (req) => {
                const pathname = new URL(req.url).pathname.replace("/public", "");
                const rest = path.join(import.meta.dir, "public", pathname);
                return new Response(Bun.file(rest));
            }
        }
    },
    port: 4444
});

console.log("Server is running on http://localhost:4444");