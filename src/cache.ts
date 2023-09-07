import fs from "fs";

// 用于存储已访问过的 URL 的文件路径
const visitedUrlsFilePath = "visitedUrls.txt";

// 创建一个 Set 来存储已经访问过的 URL
const visitedUrls = new Set();

// 读取已访问的 URL 列表文件，如果存在的话
if (fs.existsSync(visitedUrlsFilePath)) {
  const data = fs.readFileSync(visitedUrlsFilePath, "utf8");
  const urls = data.split("\n").filter((url) => url.trim() !== "");
  urls.forEach((url) => visitedUrls.add(url));
}

export function isUrlVisited(url: string) {
  // 检查 URL 是否已经被访问过
  return visitedUrls.has(url);
}

export function markUrlAsVisited(url: string) {
  // 将 URL 标记为已访问
  visitedUrls.add(url);
  // 在本地文件中追加该 URL
  fs.appendFileSync(visitedUrlsFilePath, url + "\n", "utf8");
}
