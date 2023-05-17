const fs = require("fs"); // npm install fs
const axios = require("axios"); // npm install axios
const { JSDOM } = require("jsdom"); //  npm install jsdom
const { URL } = require("url"); // npm install url

const urls = [
  "https://www.leercapitulo.com/manga/d2qhr5/oshi-no-ko/",
  "https://www.leercapitulo.com/manga/5q8ord/boku-no-kokoro-no-yabai-yatsu/",
  "https://www.leercapitulo.com/manga/jo6v1s5/yofukashi-no-uta/",
  "https://www.leercapitulo.com/manga/cgvafh/kanojo-okarishimasu/",
  "https://www.leercapitulo.com/manga/7im0lu/chainsaw-man/",
  "https://www.leercapitulo.com/manga/gcoisn/kage-no-jitsuryokusha-ni-naritakute/",
  "https://www.leercapitulo.com/manga/cco8900/black-clover/",
];

function cleanText(text) {
  return text.replace(/[^\w\s]/g, "").trim();
}

(async () => {
  let capitulos = [];
  let ultimoId = 0;

  try {
    const data = fs.readFileSync("resultados.json", "utf8");
    capitulos = JSON.parse(data);
    ultimoId = capitulos.reduce(
      (maxId, capitulo) => Math.max(maxId, capitulo.id),
      0
    );
  } catch (err) {
    console.log(
      "No se encontró el archivo resultados.json. Se creará uno nuevo."
    );
  }

  for (const url of urls) {
    try {
      const response = await axios.get(url);
      const { document } = new JSDOM(response.data).window;

      const chapters = document.querySelectorAll("li.row");
      const titulo = document.querySelector("h1");
      const imagen = document.querySelector("div.media-left.cover-detail img");

      const baseUrl = new URL(response.config.url);

      for (let i = 0; i < 2 && i < chapters.length; i++) {
        const chapter = chapters[i];
        const nombreCap = cleanText(chapter.querySelector("h4").textContent);
        const link = new URL(chapter.querySelector("a").href, baseUrl).href;
        const nombre = cleanText(titulo.textContent);
        const imagenUrl = new URL(imagen.src, baseUrl).href;

        const existente = capitulos.find(
          (capitulo) =>
            capitulo.nombre_capitulo === nombreCap && capitulo.nombre === nombre
        );
        if (existente) {
          continue;
        }

        ultimoId++;
        const capitulo = {
          id: ultimoId,
          nombre_capitulo: nombreCap,
          imagen_url: imagenUrl,
          link,
          nombre,
          leido: false,
        };
        capitulos.push(capitulo);
      }
    } catch (err) {
      console.log(`Error al realizar la solicitud HTTP a la URL: ${url}`);
    }
  }

  try {
    fs.writeFileSync(
      "./src/resultados.json",
      JSON.stringify(capitulos, null, 4)
    );
    console.log("Resultados guardados en resultados.json");
  } catch (err) {
    console.log("Error al guardar los resultados en resultados.json");
  }
})();
