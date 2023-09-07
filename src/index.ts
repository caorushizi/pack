import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { writeFile } from "fs-extra";
import yaml from "js-yaml";
import {
  generateMD5Hash,
  getDate,
  getQuestionIndex,
  getRateCount,
  getTitle,
} from "./utils";
import path from "path";
import { isUrlVisited, markUrlAsVisited } from "./cache";

const turndownService = new TurndownService();

const catMap: Record<string, string> = {
  10: "javascript",
  11: "css",
  12: "html",
  13: "react",
  14: "vue",
  15: "算法",
  16: "计算机网络",
  17: "趣味题",
  18: "nodejs",
  19: "typescript",
  20: "性能优化",
  21: "前端安全",
  23: "小程序",
  24: "es6",
  26: "编程题",
  27: "设计模式",
  28: "工程化",
  29: "工具",
  30: "计算机基础",
  31: "leetcode",
  32: "选择题",
  74: "跨端技术",
};

// 自定义处理复制按钮和代码块
turndownService.addRule("codeBlock", {
  filter: (node) =>
    node.nodeName === "DIV" && node.classList.contains("codeBox___24JI7"),
  replacement: (content, node) => {
    const codeContent = node.querySelector("code.language-typescript")
      ?.textContent;
    return `\`\`\`typescript\n${codeContent}\n\`\`\``;
  },
});

const host = "https://fe.ecool.fun";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  async function parsePage(url: string, catorgory: string) {
    if (isUrlVisited(url)) {
      return;
    }

    await page.goto(url);
    await page.waitForSelector(".markdown-body");
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    // 开始提取内容
    const body = $(".markdown-body").html() || "";
    const content = body.replace(
      /<span class="linenumber[^>]*>[^<]*<\/span>/g,
      "",
    );

    const markdown = turndownService.turndown(content);

    const title = getTitle($).replace(/\n/g, "");
    console.log(`开始解析 ${title}`);

    const metadata = {
      title,
      pubDatetime: getDate($),
      author: "caorushizi",
      tags: [catorgory],
      postSlug: generateMD5Hash(markdown),
      description: markdown.replace(/\s+/g, "").slice(0, 100),
      difficulty: getRateCount($),
      questionNumber: getQuestionIndex($),
      source: url,
    };

    const metadataString = `---\n${yaml.dump(metadata)}---\n\n`;

    await writeFile(
      path.join("posts", `${title.replace(/[/:*?"<>|]/g, "_")}.md`),
      metadataString + markdown + "\n",
    );

    await new Promise((r) => setTimeout(r, 1000));
    console.log(`解析 ${title} 完成`);

    markUrlAsVisited(url);
  }

  async function parsePageList(tagId: number, pageNum: number) {
    console.log(`开始解析 ${catMap[tagId]} 第 ${pageNum} 页`);

    const url = `${host}/topic-list?pageNumber=${pageNum}&orderBy=updateTime&order=desc&tagId=${tagId}`;
    console.log(`开始解析 ${url}`);
    await page.goto(url);
    await page.waitForSelector(".content-container .listBox___1DR04");

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const list = $(".topicItem___9dvlk");

    if (list.length === 0) {
      return false;
    }

    const linkArr: string[] = [];
    list.each((index, element) => {
      const link = $(element).find(".topicItemLink____gtqQ").attr("href");
      linkArr.push(host + link?.replace("/topic", "/topic-answer"));
    });

    for (const link of linkArr) {
      console.log(`开始解析 ${link}`);
      await parsePage(link, catMap[tagId]);
    }

    return true;
  }

  for (const key of Object.keys(catMap)) {
    console.log(`开始解析 ${catMap[key]}`);
    let pageNum = 1;
    while (await parsePageList(Number(key), pageNum)) {
      pageNum++;
    }
  }

  await browser.close();
})();
