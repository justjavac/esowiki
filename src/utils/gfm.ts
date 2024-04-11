import { combineExtensions, combineHtmlExtensions } from "micromark-util-combine-extensions";
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from "micromark-extension-gfm-autolink-literal";
import { gfmFootnote, gfmFootnoteHtml, HtmlOptions } from "micromark-extension-gfm-footnote";
import { gfmStrikethrough, gfmStrikethroughHtml, Options } from "micromark-extension-gfm-strikethrough";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import { gfmTaskListItem, gfmTaskListItemHtml } from "micromark-extension-gfm-task-list-item";
import type { Extension, HtmlExtension } from "micromark-util-types";

export function gfm(): Extension {
  return combineExtensions([
    gfmAutolinkLiteral() as Extension,
    gfmFootnote() as Extension,
    gfmStrikethrough() as Extension,
    gfmTable() as Extension,
    gfmTaskListItem() as Extension,
  ]) as Extension;
}

export function gfmHtml(options: HtmlOptions): Extension {
  return combineHtmlExtensions([
    gfmAutolinkLiteralHtml() as HtmlExtension,
    gfmFootnoteHtml(options) as HtmlExtension,
    gfmStrikethroughHtml() as HtmlExtension,
    gfmTableHtml() as HtmlExtension,
    gfmTaskListItemHtml() as HtmlExtension,
  ]) as Extension;
}
