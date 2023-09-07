import { CheerioAPI } from "cheerio";

export function getRateCount($: CheerioAPI) {
  const rate = $(".secondBox___2B0S4 .ant-rate");
  const star = rate.find(".ant-rate-star.ant-rate-star-full").length;
  const half = rate.find(".ant-rate-star.ant-rate-star-half").length;

  return star + (half ? 0.5 : 0);
}

export function getDate($: CheerioAPI) {
  const date = $(".secondBox___2B0S4>span").text();
  const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
  return date.match(dateRegex)?.[0];
}

export function getTitle($: CheerioAPI) {
  return $(".title___3qmX3 span:nth-child(3)").text();
}

export function getQuestionIndex($: CheerioAPI) {
  const index = $(".title___3qmX3 span:nth-child(2)").text();
  const [questionIndex] = index.match(/\d+/g)?.map(Number) || [];
  return questionIndex;
}
