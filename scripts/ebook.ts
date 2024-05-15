// @deno-types = "npm:@types/pdfkit"
import PDFDocument from "npm:pdfkit";
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
const books = parse(Deno.readTextFileSync("./gamedata/librarian.csv"), {
  skipFirstRow: true,
  columns,
}) as BookItem[];

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
  if (book.category === "制作书") continue;
  if (book.category.endsWith("样式")) continue;
  renderBook(doc, book);
}
doc.end();
