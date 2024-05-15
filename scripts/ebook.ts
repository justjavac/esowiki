// @deno-types = "npm:@types/pdfkit"
import PDFDocument from "npm:pdfkit";
import epub from "npm:epub-gen";
import { micromark } from "npm:micromark";
import fs from "node:fs";
import { parse } from "https://deno.land/std@0.162.0/encoding/csv.ts";

type BookItem = {
  bookId: string;
  title: string;
  category: string;
  medium: number;
  body: string;
};
const columns = ["bookId", "title", "category", "medium", "body"];
const books = (
  parse(Deno.readTextFileSync("./gamedata/librarian.csv"), {
    skipFirstRow: true,
    columns,
  }) as BookItem[]
)
  .filter((book) => book.category !== "制作书")
  .filter((book) => !book.category.endsWith("样式"))
  .filter((book) => !book.title.startsWith("制作样式书"));

let currentCategory = "";

function renderTitlePage(doc: typeof PDFDocument) {
  const title = "上古卷轴online";
  const author = "迷渡(@justjavac)";
  const version = `v1.0.0`;

  doc.fontSize(30);
  doc.y = doc.page.height / 3 - doc.currentLineHeight();
  doc.text(title, { align: "center" });
  doc.h1Outline = doc.outline.addItem(title);

  doc.moveDown();
  doc.fontSize(20);
  doc.fillColor("#404040");
  doc.text(author, { align: "center" });

  doc.moveDown();
  doc.fontSize(20);
  doc.fillColor("#404040");
  doc.text(version, { align: "center" });

  doc.addPage();
}

function renderBook(doc: PDFKit.PDFDocument, book: BookItem) {
  if (currentCategory !== book.category) {
    currentCategory = book.category;
    doc.fontSize(30);
    doc.text(currentCategory, { align: "center" });
    doc.y += 15;
    doc.h1Outline = doc.outline.addItem(currentCategory);
  }

  doc.fontSize(24);
  doc.text(book.title);
  doc.y += 10;
  doc.h1Outline.addItem(book.title);

  doc.fontSize(14);
  doc.fillColor("#404040");
  doc.text(book.body.replaceAll("\\n", "\n").replace(/[\n\r]+/g, "\n\n"));

  doc.addPage();
}

const info: PDFKit.DocumentInfo = {
  Producer: "justjavac",
  Creator: "justjavac",
  CreationDate: new Date("2024-01-01"),
  Title: "上古卷轴online",
  Author: "迷渡",
  Subject: "上古卷轴online书籍",
  Keywords: "上古卷轴,上古卷轴online,老滚,老滚online,eso,eso online",
  ModDate: new Date(),
};

const doc = new PDFDocument({
  displayTitle: true,
  info,
});
doc.font("gamedata/fonts/myingheiprc-w5.otf");
doc.pipe(fs.createWriteStream("./epub/eso.pdf"));

renderTitlePage(doc);
for (const book of books) {
  renderBook(doc, book);
}
doc.end();

// e-pub
const content = books.map((book) => ({
  title: book.title,
  data: micromark(
    book.body.replaceAll("\\n", "\n").replace(/[\n\r]+/g, "\n\n")
  ),
}));

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
