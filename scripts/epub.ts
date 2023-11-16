import epub from "npm:epub-gen";
import { micromark } from "npm:micromark";

const ESO_API_URL = "https://esoapi.denohub.com";

const content = [];

for (let i = 1; i <= 7; i++) {
  const query = new URLSearchParams();
  query.set("pagination[pageSize]", "1000");
  query.set("pagination[page]", i.toString());
  query.set("sort[0]", "id:asc");

  const response = await fetch(`${ESO_API_URL}/api/books?${query}`);
  const { data } = await response.json();

  for (const book of data) {
    content.push({
      title: book.attributes.title,
      data: micromark(book.attributes.body),
    });
  }
}

const options = {
  title: "上古卷轴OL",
  author: "eso",
  publisher: "eso",
  output: "./epub/eso.epub",
  lang: "zh",
  tocTitle: "目录",
  content,
};

await new epub(options).promise;
