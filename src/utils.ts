import { CheerioAPI } from "cheerio";
import * as crypto from "crypto";
import moment from "moment";

export function getRateCount($: CheerioAPI) {
  const rate = $(".secondBox___2B0S4 .ant-rate");
  const star = rate.find(".ant-rate-star.ant-rate-star-full").length;
  const half = rate.find(".ant-rate-star.ant-rate-star-half").length;

  return star + (half ? 0.5 : 0);
}

export function getDate($: CheerioAPI) {
  const date = $(".secondBox___2B0S4>span").text();
  const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
  return moment(date.match(dateRegex)?.[0]).toDate();
}

export function getTitle($: CheerioAPI) {
  return $(".title___3qmX3 span:nth-child(3)").text();
}

export function getQuestionIndex($: CheerioAPI) {
  const index = $(".title___3qmX3 span:nth-child(2)").text();
  const [questionIndex] = index.match(/\d+/g)?.map(Number) || [];
  return questionIndex;
}

export function generateMD5Hash(inputString: string): string {
  // 创建 MD5 散列对象
  const md5Hash = crypto.createHash("md5");

  // 将字符串传递给散列对象
  md5Hash.update(inputString);

  // 计算散列值并以十六进制字符串形式获取它
  const md5HashHex: string = md5Hash.digest("hex");

  return md5HashHex;
}
