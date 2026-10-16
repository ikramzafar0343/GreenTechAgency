import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "../../messages");

const PATCHES = {
  "zh-CN": {
    "sections.portfolioCategories": "作品集类别",
    "sections.websiteTypes": "网站类型",
    "sections.socialMediaTypes": "社交媒体类型",
    "sections.projectSteps": "项目步骤",
    "sections.previousProject": "上一个项目",
    "sections.nextProject": "下一个项目",
    "sections.archiveViewMode": "归档视图模式",
    "sections.viewLarge": "大布局查看",
    "sections.viewSmall": "小布局查看",
    "sections.ourTeam": "我们的团队成员",
    "sections.exploreServices": "探索我们的服务",
    "sections.teamPortraits": "团队肖像",
    "sections.brandsWeWorkWith": "我们合作的品牌",
    "sections.clientBrands": "客户品牌",
    "sections.impactResults": "影响与项目成果",
    "sections.teamPhotoPending": "团队照片待审批",
    "sections.servicesHubUnavailable": "服务中心不可用",
    "sections.impactUnavailable": "影响部分不可用",
    "sections.servicePhotoPairA": "服务摄影组 A",
    "sections.servicePhotoPairB": "服务摄影组 B",
    "sections.howWeWorkProcess": "我们的工作流程",
    "seo.defaultDescription": "GreenTech Agency — 设计、工程与增长。",
    "errors.fetchFailed": "无法加载此内容。",
    "errors.footerUnavailable": "页脚不可用",
    "errors.ctaUnavailable": "结束行动号召不可用",
    "legal.privacyTitle": "隐私政策",
    "legal.termsTitle": "条款与条件",
    "forms.validationEmail": "请输入有效的电子邮件地址。",
    "forms.success": "谢谢 — 我们已收到您的消息。",
    "forms.error": "无法发送您的消息。请重试。",
    "forms.backToChoices": "返回选项",
    "contact.pageNavigation": "联系页导航",
    "home.heroUnavailable": "主视觉不可用",
    "home.heroNotPublished": "此内容尚未发布。",
    "home.servicesUnavailable": "服务不可用",
    "home.portfolioUnavailable": "作品集不可用",
    "home.howWeWorkUnavailable": "工作方式不可用",
    "home.statsUnavailable": "统计数据不可用",
    "home.testimonialsUnavailable": "客户评价不可用",
    "home.insightsUnavailable": "见解不可用",
    "home.whyChooseUnavailable": "为何选择我们不可用",
    "home.faqUnavailable": "常见问题不可用",
  },
};

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flatten(v, path));
    else out[path] = v;
  }
  return out;
}
function unflatten(flat) {
  const root = {};
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts.at(-1)] = value;
  }
  return root;
}

const en = flatten(JSON.parse(readFileSync(join(dir, "en.json"), "utf8")));

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const locale = file.replace(/\.json$/, "");
  const flat = flatten(JSON.parse(readFileSync(join(dir, file), "utf8")));
  const patch = PATCHES[locale] || {};
  let n = 0;
  for (const [key, enVal] of Object.entries(en)) {
    if (patch[key]) {
      flat[key] = patch[key];
      n++;
      continue;
    }
    // If still identical to English and we have es as fallback for Latin locales only — skip.
  }
  flat["seo.siteName"] = "GreenTech Agency";
  writeFileSync(join(dir, file), `${JSON.stringify(unflatten(flat), null, 2)}\n`);
  if (n) console.log(locale, "patched", n);
}
console.log("done");
