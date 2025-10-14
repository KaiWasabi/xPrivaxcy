// Resume and Projects content with localization
const projects = {
  en: [
    { title: "AGLC Citation Helper", url: "https://github.com/kaiwatanabe-com/AGLC4-GEN", desc: "One‑click formatting for AGLC references." },
    { title: "Political Compass Tool", url: "https://github.com/kaiwatanabe-com/Political-Compass", desc: "Open source Political Compass Tester." },
    { title: "MOUD Perception Study", url: "https://scholarsphere.psu.edu/resources/c843c132-641e-4c42-a61a-fa5e2f3b9e93", desc: "Co‑authored research on medication for OUD." },
    { title: "Secure Image Redaction Tool", url: "https://github.com/kaiwatanabe-com/Redact-It", desc: "Open source HTML based secure image redaction tool." },
    { title: "Mores Code Encrypter", url: "https://github.com/kaiwatanabe-com/MoresEncryptor", desc: "Open source HTML based Mores Code Encryption Tool." },
    { title: "Mores Code Learner", url: "https://github.com/kaiwatanabe-com/mores", desc: "Open source HTML based Mores Code Learning Tool." },
  ],
  jp: [
    { title: "AGLC引用フォーマッター", url: "https://github.com/kaiwatanabe-com/AGLC4-GEN", desc: "AGLCの参考文献をワンクリックで整形。" },
{ title: "政治コンパス診断ツール", url: "https://github.com/kaiwatanabe-com/Political-Compass", desc: "オープンソースの政治コンパス診断。" },
{ title: "MOUD認識研究", url: "https://scholarsphere.psu.edu/resources/c843c132-641e-4c42-a61a-fa5e2f3b9e93", desc: "OUD治療薬（MOUD）に関する共同研究。" },
{ title: "画像秘匿化ツール", url: "https://github.com/kaiwatanabe-com/Redact-It", desc: "オープンソースのHTMLベース画像秘匿化（墨消し）ツール。" },
{ title: "モールス信号暗号化ツール", url: "https://github.com/kaiwatanabe-com/MoresEncryptor", desc: "オープンソースのHTMLベースのモールス信号暗号化ツール。" },
{ title: "モールス信号学習ツール", url: "https://github.com/kaiwatanabe-com/mores", desc: "オープンソースのHTMLベースのモールス信号学習ツール。" },
  ]
};

const englishContent = {
  name: "Kai Watanabe",
  headline:
    "I'm a driven law student skilled in legal research, digital transformation, and dispute resolution, committed to innovation, privacy, and sustainability.",
  sections: [
    {
      id: "education",
      title: "Education",
      data: [
        "LL.B., Australian National University, 2024 – Present",
        "Coursework for B.A. Criminal Justice, Pennsylvania State University, 2022 – 2023",
      ],
    },
    {
      id: "work-history",
      title: "Work History",
      data: [
        "Japanese Ground Self-Defense Force, Reservist Candidate, Jun 2025 – Present",
        "ANU Students' Association, International Student Dept., Wellbeing Director, Dec 2024 – Present",
        "Office of The Hon. Kono Taro MP, Policy Research Intern, Dec 2024 – Present",
        "ANU Residential Mentor, Dec 2024 – Present",
        "ANU Appeals Panel, Oct 2024 – Jun 2025",
        "ANU Japan Club, President, Oct 2024 – Present",
        "ANU Japan Club, Secretary General, Aug 2024 – Oct 2024",
        "ANU Students' Association, Disputes Committee, Jun 2024 – Present",
        "TEDxYouth@Canberra, Marketing Associate, Mar 2024 – Oct 2024",
        "Pennsylvania State University, Research Assistant, Oct 2022 – Aug 2023",
      ],
    },
    {
      id: "awards",
      title: "Awards",
      data: [
        "President Walker Medallion, Pennsylvania State University, 2023",
        "Sigma Xi Behrend Competition, 2nd Place, 2023",
        "Spring Dean's List, Pennsylvania State University, 2023",
        "Fall Dean's List, Pennsylvania State University, 2023",
      ],
    },
    {
      id: "certifications",
      title: "Certifications",
      data: [
        "U.S. DoD OPSEC Awareness Training, 2025",
        "U.S. DoD Counterintelligence Awareness and Reporting, 2025",
        "U.S. DoD Counterintelligence and Security Awareness, 2025",
        "Australian Fire Safety and Emergency Evacuation, 2025",
        "Australian CPR and First Aid, 2025",
        "ACT Responsible Service of Alcohol, 2024",
        "INFOSEC Privacy Fundamentals, 2023",
        "Google Cybersecurity Specialization, 2023",
        "CITI Social and Behavioral Human Subjects Research, 2023",
      ],
    },
    {
      id: "publications",
      title: "Publications",
      data: "Perception of Medication for Opioid Use Disorder (doi:10.26207/ec8b-2752)",
    },
  ],
};

const japaneseContent = {
  name: "渡部　帆",
  headline:
    "法律リサーチ、デジタル変革、紛争解決に強みを持ち、革新性、プライバシー保護、持続可能性を重視する法学専攻の学生です。",
  sections: [
    {
      id: "education",
      title: "学歴",
      data: ["法学士号、オーストラリア国立大学、2024年〜現在", "刑事司法学、ペンシルバニア州立大学、2022年〜2023年"],
    },
    {
      id: "work-history",
      title: "職歴",
      data: [
        "陸上自衛隊、予備自衛官補、2025年6月～現在",
        "オーストラリア国立大学学生自治会 国際学生課 健康福祉長、2024年12月〜現在",
        "衆議院議員 河野太郎事務所、政務リサーチインターン、2024年12月〜現在",
        "オーストラリア国立大学、学寮長補佐、2024年12月〜現在",
        "オーストラリア国立大学、懲罰控訴審議委員、2024年10月〜2025年6月",
        "オーストラリア国立大学日本クラブ、会長、2024年10月〜現在",
        "オーストラリア国立大学日本クラブ、事務局長・書記官、2024年7月〜2024年10月",
        "オーストラリア国立大学学生自治会、紛争審判委員、2024年4月〜現在",
        "TEDxYouth@Canberra、マーケティングアソシエイト、2024年3月〜2024年10月",
        "ペンシルベニア州立大学、研究助手、2022年10月〜2023年8月",
      ],
    },
    {
      id: "awards",
      title: "受賞歴",
      data: [
        "ウォーカー学長賞（ペンシルバニア州立大学）、2023年",
        "シグマ・サイ・ベーレンド研究学会 2位、2023年",
        "春学期 学長賞（ペンシルバニア州立大学）、2023年",
        "秋学期 学長賞（ペンシルバニア州立大学）、2023年",
      ],
    },
    {
      id: "certifications",
      title: "認定資格",
      data: [
        "米国防総省 OPSEC 意識向上研修、2025年",
        "米国防総省 防諜意識と報告研修、2025年",
        "米国防総省 防諜・セキュリティ意識向上研修、2025年",
        "豪州 火災安全・避難研修、2025年",
        "豪州 心肺蘇生・応急手当、2025年",
        "ACT アルコール適正提供資格、2024年",
        "INFOSEC プライバシー基礎、2023年",
        "Google サイバーセキュリティ専門、2023年",
        "CITI 社会・行動科学 人体研究コース修了、2023年",
      ],
    },
    {
      id: "publications",
      title: "研究・出版物",
      data: "オピオイド使用障害に対する薬物治療の認識 (doi:10.26207/ec8b-2752)",
    },
  ],
};

function projectsHTML(lang) {
  const list = lang === "jp" ? projects.jp : projects.en;
  const items = list
    .map(
      (p) =>
        `<li class="projects-item"><a href="${p.url}" target="_self" rel="noopener">${p.title}</a><span class="desc"> — ${p.desc}</span></li>`
    )
    .join("");
  const title = lang === "jp" ? "プロジェクト" : "Projects";
  return `
    <section id="projects" class="reveal-section">
      <details>
        <summary>${title}</summary>
        <div class="details-content">
          <ul class="projects-list">
            ${items}
          </ul>
        </div>
      </details>
    </section>`;
}

function generateResumeHTML(content, lang) {
  let sectionsHTML = "";
  let insertedProjects = false;

  content.sections.forEach((section) => {
    const data = section.data;
    let sectionMarkup = "";

    if (Array.isArray(data)) {
      sectionMarkup = "<ul>";
      data.forEach((item) => {
        sectionMarkup += `<li>${item}</li>`;
      });
      sectionMarkup += "</ul>";
    } else {
      sectionMarkup = `<p>${data}</p>`;
    }

    sectionsHTML += `
      <section id="${section.id}" class="reveal-section">
        <details>
          <summary>${section.title}</summary>
          <div class="details-content">
            ${sectionMarkup}
          </div>
        </details>
      </section>`;

    // Insert Projects immediately after Publications
    if (!insertedProjects && section.id === "publications") {
      sectionsHTML += projectsHTML(lang);
      insertedProjects = true;
    }
  });

  // Fallback: if no publications section, append at end
  if (!insertedProjects) {
    sectionsHTML += projectsHTML(lang);
  }

  return sectionsHTML;
}

// Smoothly render content and keep open states
function renderResume(lang) {
  const container = document.getElementById("resumeContainer");
  const nameHeading = document.getElementById("nameHeading");
  const personalHeadline = document.getElementById("personalHeadline");
  const languageSwitcher = document.getElementById("languageSwitcher");
  const content = lang === "jp" ? japaneseContent : englishContent;

  // Preserve open states
  const openStates = {};
  document.querySelectorAll("section details").forEach((d) => {
    const secId = d.closest("section")?.id;
    if (secId) openStates[secId] = d.open;
  });

  // Update name
  nameHeading.style.opacity = "0.5";
  setTimeout(() => {
    nameHeading.textContent = content.name;
    nameHeading.style.opacity = "1";
  }, 150);

  // Update switcher visual state
  languageSwitcher.className = lang === "jp" ? "jp" : "";
  document.getElementById("lang-en").classList.toggle("active", lang === "en");
  document.getElementById("lang-jp").classList.toggle("active", lang === "jp");
  document.getElementById("lang-en").setAttribute("aria-selected", lang === "en");
  document.getElementById("lang-jp").setAttribute("aria-selected", lang === "jp");

  // Headline transition
  let headlineContainer = personalHeadline.querySelector(".headline-container");
  if (!headlineContainer) {
    headlineContainer = document.createElement("div");
    headlineContainer.className = "headline-container";
    const initialText = document.createElement("div");
    initialText.className = "headline-text active";
    initialText.textContent = content.headline;
    headlineContainer.appendChild(initialText);
    personalHeadline.innerHTML = "";
    personalHeadline.appendChild(headlineContainer);
  } else {
    const newHeadline = document.createElement("div");
    newHeadline.className = "headline-text entering";
    newHeadline.textContent = content.headline;
    headlineContainer.appendChild(newHeadline);
    void newHeadline.offsetHeight;
    const currentHeadline = headlineContainer.querySelector(".headline-text.active");
    if (currentHeadline) {
      currentHeadline.classList.remove("active");
      currentHeadline.classList.add("exiting");
    }
    setTimeout(() => {
      newHeadline.classList.remove("entering");
      newHeadline.classList.add("active");
      setTimeout(() => {
        headlineContainer.querySelectorAll(".headline-text.exiting").forEach((el) => el.remove());
      }, 800);
    }, 50);
  }

  // Update resume body
  container.innerHTML = generateResumeHTML(content, lang);

  // Restore open states (Projects stays open by default)
  Object.keys(openStates).forEach((id) => {
    const el = document.getElementById(id)?.querySelector("details");
    if (el && openStates[id]) el.open = true;
  });

  // Attach scroll reveal
  attachScrollReveal();
}

// IntersectionObserver for reveal-on-scroll
function attachScrollReveal() {
  const revealTargets = document.querySelectorAll(".reveal-section");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    revealTargets.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((t) => io.observe(t));
}

// Initialize
function initPage() {
  document.getElementById("lang-en").addEventListener("click", () => renderResume("en"));
  document.getElementById("lang-jp").addEventListener("click", () => renderResume("jp"));

  // Initialize with English content
  renderResume("en");

  // Last updated
  const lastUpdatedElement = document.getElementById("lastUpdated");
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = "Last Updated: " + new Date(document.lastModified).toLocaleDateString();
  }
}

document.addEventListener("DOMContentLoaded", initPage);
