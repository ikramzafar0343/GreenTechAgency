const text = "Digital Solutions That Drive Business Growth";

async function main() {
  for (const tl of ["es", "ar", "de", "fr"]) {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", tl);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);
    const response = await fetch(url.toString());
    const data = (await response.json()) as unknown;
    const out = Array.isArray(data) && Array.isArray(data[0])
      ? data[0]
          .map((part) =>
            Array.isArray(part) && typeof part[0] === "string" ? part[0] : "",
          )
          .join("")
      : String(data);
    console.log(tl, response.status, out);
  }
}

main();
