// Resume content for English and Japanese with localized download text
const englishContent = {
  name: "Kai Watanabe",
  downloadLabel: "Download Resume",
  sections: {
    Education: [
      "LL.B., Australian National University, 2024 - Present.",
      "Coursework for B.A. Criminal Justice, Pennsylvania State University, 2022 - 2023."
    ],
    "Work History": [
      "Office of The Hon. Kono Taro MP Policy Research Intern, Dec. 2024 - Present",
      "ANU Residential Mentor, Dec. 2024 - Present.",
      "The Australian National University Appeals Panel, Oct. 2024 - Present",
      "President of ANU Japan Club, Oct. 2024 - Present.",
      "Secretary General for ANU Japan Club, Aug. 2024 - Oct. 2024",
      "ANU Students' Association, Disputes Committee, Jun. 2024 - Present",
      "TEDxYouth@Canberra, Marketing Associate, Mar. 2024 - Oct. 2024",
      "The Pennsylvania State University, Research Assistant, Oct. 2022 - Aug. 2023"
    ],
    Awards: [
      "President Walker Medalion, Pennsylvania State University, 2023",
      "Sigma Xi Behrend Competition, 2nd Place, 2023",
      "Spring Deans List, Pennsylvania State University, 2023",
      "Fall Deans List, Pennsylvania State University, 2023"
    ],
    Certifications: [
      "U.S. Department of Defense Operation Security (OPSEC) Awareness Training, 2025",
      "U.S. Department of Defense Counterintelligence Awareness and Reporting Training, 2025",
      "U.S. Department of Defense Counterintelligence and Security Awareness Training, 2025",
      "Australian Fire Safety and Emergency Evacuation Training, 2025",
      "Australian CPR and First Aid Training, 2025",
      "ACT Responsible Service of Alcohol, 2024",
      "INFOSEC Privacy Fundamentals, 2023",
      "Google Cybersecurity Specialization, 2023",
      "CITI Social and Behavioral Human Subject Research Course Certification, 2023"
    ],
    Publications:
      "Perception of Medication for Opioid Use Disorder (doi:10.26207/ec8b-2752)"
  }
};

const japaneseContent = {
  name: "渡部　帆",
  downloadLabel: "履歴書をダウンロード",
  sections: {
    学歴: [
      "法学士号、オーストラリア国立大学、2024年〜現在.",
      "刑事司法学、ペンシルバニア州立大学、2022年〜2023年"
    ],
    職歴: [
      "衆議院議員河野太郎事務所、政務リサーチインターン、2024年12月〜現在",
      "オーストラリア国立大学、学寮長補佐、2024年12月〜現在",
      "オーストラリア国立大学、懲罰控訴審議委員、2024年10月〜",
      "豪州国立大日本クラブ、会長、2025年10月〜現在",
      "豪州国立大日本クラブ、事務局長・書記官、2024年7月〜2024年10月",
      "豪州国立大学生自治会、紛争審判委員、2024年4月〜現在",
      "TEDxYouth@Canberra、マーケティングアソシエイト、2024年3月〜2024年10月",
      "ペンシルベニア州立大学、研究助手、2023年〜2024年"
    ],
    受賞歴: [
      "ペンシルバニア州立大学、ウォーカー学長賞、2023年",
      "シグマ・サイ・ベーレンド研究学会2位, 2023年",
      "春学期ペンシルバニア州立大学 学長表彰リスト、2023年",
      "秋学期ペンシルバニア州立大学 学長表彰リスト、2023年"
    ],
    認定資格: [
      "米国防省国防防諜安全保障局 作戦セキュリティ（OPSEC）意識向上研修、2025年",
      "米国防省国防防諜安全保障局 国防総省向け防諜意識および報告研修、2025年",
      "米国防省国防防諜安全保障局 防諜およびセキュリティ意識向上トレーニング、2025年",
      "豪火災非常避難及び消火資格、2025年",
      "豪心肺蘇生・人工呼吸資格、2025年",
      "豪応急処置資格、2025年",
      "自殺介入技能研修（QPRプログラム）、2025年",
      "ACTアルコール適正提供資格、2024",
      "INFOSECプライバシー基礎講座、2023年",
      "Googleサイバーセキュリティ専門資格、2023年",
      "CITI社会・行動科学における人体研究コース修了認定、2023年"
    ],
    "研究・出版物":
      "オピオイド使用障害に対する薬物治療の認識 (doi:10.26207/ec8b-2752)"
  }
};

// Generate resume HTML without jump-to links; only a header download button is included.
function generateResumeHTML(content) {
  let headerHTML = `<div id="resumeHeader">
    <a href="resume.pdf" class="downloadButton" download>${content.downloadLabel}</a>
  </div>`;
  let sectionsHTML = "";

  for (const sectionTitle in content.sections) {
    const sectionId = sectionTitle.replace(/\s/g, "-");
    let data = content.sections[sectionTitle];
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
      <section id="${sectionId}">
        <details>
          <summary>${sectionTitle}</summary>
          <div class="details-content">
            ${sectionMarkup}
          </div>
        </details>
      </section>`;
  }
  return headerHTML + sectionsHTML;
}

function renderResume(lang) {
  const container = document.getElementById("resumeContainer");
  const nameHeading = document.getElementById("nameHeading");
  const content = lang === "jp" ? japaneseContent : englishContent;
  nameHeading.textContent = content.name;
  container.innerHTML = generateResumeHTML(content);
}

document.getElementById("lang-en").addEventListener("click", () => {
  renderResume("en");
});
document.getElementById("lang-jp").addEventListener("click", () => {
  renderResume("jp");
});

renderResume("en");

const lastUpdatedElement = document.getElementById("lastUpdated");
if (lastUpdatedElement) {
  lastUpdatedElement.textContent =
    "Last Updated: " + new Date(document.lastModified).toLocaleDateString();
}
