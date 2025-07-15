// Resume content for English and Japanese with localized download text
const englishContent = {
  name: "Kai Watanabe",
  headline:
    "I'm a driven law student skilled in legal research, digital transformation, and dispute resolution, committed to innovation, privacy, and sustainability.",
  downloadLabel: "Download Resume",
  resumeUrl: "https://www.kaiwatanabe.com/404", // Placeholder URL
  sections: [
    {
      id: "education",
      title: "Education",
      data: [
        "LL.B., Australian National University, 2024 - Present.",
        "Coursework for B.A. Criminal Justice, Pennsylvania State University, 2022 - 2023.",
      ],
    },
    {
      id: "work-history",
      title: "Work History",
      data: [
        "Japanese Ground Self-Defense Force, Reservist Candidate, June 2025 - Present",
        "ANU Student's Association International Student Dept., Wellbeing Director, Dec. 2024 -  Present",
        "Office of The Hon. Kono Taro MP Policy Research Intern, Dec. 2024 - Present",
        "ANU Residential Mentor, Dec. 2024 - Present.",
        "The Australian National University Appeals Panel, Oct. 2024 - June. 2025",
        "President of ANU Japan Club, Oct. 2024 - Present.",
        "Secretary General for ANU Japan Club, Aug. 2024 - Oct. 2024",
        "ANU Students' Association, Disputes Committee, Jun. 2024 - Present",
        "TEDxYouth@Canberra, Marketing Associate, Mar. 2024 - Oct. 2024",
        "The Pennsylvania State University, Research Assistant, Oct. 2022 - Aug. 2023",
      ],
    },
    {
      id: "awards",
      title: "Awards",
      data: [
        "President Walker Medalion, Pennsylvania State University, 2023",
        "Sigma Xi Behrend Competition, 2nd Place, 2023",
        "Spring Deans List, Pennsylvania State University, 2023",
        "Fall Deans List, Pennsylvania State University, 2023",
      ],
    },
    {
      id: "certifications",
      title: "Certifications",
      data: [
        "U.S. Department of Defense Operation Security (OPSEC) Awareness Training, 2025",
        "U.S. Department of Defense Counterintelligence Awareness and Reporting Training, 2025",
        "U.S. Department of Defense Counterintelligence and Security Awareness Training, 2025",
        "Australian Fire Safety and Emergency Evacuation Training, 2025",
        "Australian CPR and First Aid Training, 2025",
        "ACT Responsible Service of Alcohol, 2024",
        "INFOSEC Privacy Fundamentals, 2023",
        "Google Cybersecurity Specialization, 2023",
        "CITI Social and Behavioral Human Subject Research Course Certification, 2023",
      ],
    },
    {
      id: "publications",
      title: "Publications",
      data: "Perception of Medication for Opioid Use Disorder (doi:10.26207/ec8b-2752)",
    },
  ],
}

const japaneseContent = {
  name: "渡部　帆",
  headline:
    "法律リサーチ、デジタル変革、紛争解決に強みを持ち、革新性、プライバシー保護、持続可能性を重視する法学専攻の学生です。",
  downloadLabel: "履歴書をダウンロード",
  resumeUrl: "https://www.kaiwatanabe.com/404", // Placeholder URL
  sections: [
    {
      id: "education",
      title: "学歴",
      data: ["法学士号、オーストラリア国立大学、2024年〜現在.", "刑事司法学、ペンシルバニア州立大学、2022年〜2023年"],
    },
    {
      id: "work-history",
      title: "職歴",
      data: [
        "陸上自衛隊、予備自衛官補、2025年6月～現在",
        "オーストラリア国立大学学生自治会、留学生担当課健康福祉長、2024年12月〜現在",
        "衆議院議員河野太郎事務所、政務リサーチインターン、2024年12月〜現在",
        "オーストラリア国立大学、学寮長補佐、2024年12月〜現在",
        "オーストラリア国立大学、懲罰控訴審議委員、2024年10月〜2025年6月",
        "オーストラリア国立大学日本クラブ、会長、2025年10月〜現在",
        "オーストラリア国立大学日本クラブ、事務局長・書記官、2024年7月〜2024年10月",
        "オーストラリア国立大学学生自治会、紛争審判委員、2024年4月〜現在",
        "TEDxYouth@Canberra、マーケティングアソシエイト、2024年3月〜2024年10月",
        "ペンシルベニア州立大学、研究助手、2023年〜2024年",
      ],
    },
    {
      id: "awards",
      title: "受賞歴",
      data: [
        "ペンシルバニア州立大学、ウォーカー学長賞、2023年",
        "シグマ・サイ・ベーレンド研究学会2位, 2023年",
        "春学期ペンシルバニア州立大学 学長表彰リスト、2023年",
        "秋学期ペンシルバニア州立大学 学長表彰リスト、2023年",
      ],
    },
    {
      id: "certifications",
      title: "認定資格",
      data: [
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
        "CITI社会・行動科学における人体研究コース修了認定、2023年",
      ],
    },
    {
      id: "publications",
      title: "研究・出版物",
      data: "オピオイド使用障害に対する薬物治療の認識 (doi:10.26207/ec8b-2752)",
    },
  ],
}

// Generate resume HTML with proper animations
function generateResumeHTML(content) {
  const headerHTML = `<div id="resumeHeader">
    <a href="${content.resumeUrl}" class="downloadButton" target="_blank">${content.downloadLabel}</a>
  </div>`

  let sectionsHTML = ""

  content.sections.forEach((section) => {
    const sectionId = section.id
    const data = section.data
    let sectionMarkup = ""

    if (Array.isArray(data)) {
      sectionMarkup = "<ul>"
      data.forEach((item) => {
        sectionMarkup += `<li>${item}</li>`
      })
      sectionMarkup += "</ul>"
    } else {
      sectionMarkup = `<p>${data}</p>`
    }

    sectionsHTML += `
      <section id="${sectionId}">
        <details>
          <summary>${section.title}</summary>
          <div class="details-content">
            ${sectionMarkup}
          </div>
        </details>
      </section>`
  })

  return headerHTML + sectionsHTML
}

// Improved renderResume function with smoother transitions
function renderResume(lang) {
  const container = document.getElementById("resumeContainer")
  const nameHeading = document.getElementById("nameHeading")
  const personalHeadline = document.getElementById("personalHeadline")
  const languageSwitcher = document.getElementById("languageSwitcher")
  const content = lang === "jp" ? japaneseContent : englishContent

  // Store the open state of current details elements
  const openSections = {}
  document.querySelectorAll("details").forEach((detail) => {
    // Get the section ID from the parent section
    const sectionId = detail.parentElement.id
    openSections[sectionId] = detail.hasAttribute("open")
  })

  // Update name with smooth transition
  nameHeading.style.opacity = "0.5"
  setTimeout(() => {
    nameHeading.textContent = content.name
    nameHeading.style.opacity = "1"
  }, 200)

  // Update language switcher state
  languageSwitcher.className = lang === "jp" ? "jp" : ""
  document.getElementById("lang-en").classList.toggle("active", lang === "en")
  document.getElementById("lang-jp").classList.toggle("active", lang === "jp")

  // Improved headline transition
  // First, check if the headline container exists
  let headlineContainer = personalHeadline.querySelector(".headline-container")

  // If not, create it and the initial headline text
  if (!headlineContainer) {
    headlineContainer = document.createElement("div")
    headlineContainer.className = "headline-container"

    const initialText = document.createElement("div")
    initialText.className = "headline-text active"
    initialText.textContent = content.headline

    headlineContainer.appendChild(initialText)
    personalHeadline.innerHTML = ""
    personalHeadline.appendChild(headlineContainer)
  } else {
    // Create a new headline element
    const newHeadline = document.createElement("div")
    newHeadline.className = "headline-text entering"
    newHeadline.textContent = content.headline

    // Add the new headline
    headlineContainer.appendChild(newHeadline)

    // Force reflow
    newHeadline.offsetHeight

    // Mark the current active headline as exiting
    const currentHeadline = headlineContainer.querySelector(".headline-text.active")
    if (currentHeadline) {
      currentHeadline.classList.remove("active")
      currentHeadline.classList.add("exiting")
    }

    // Activate the new headline
    setTimeout(() => {
      newHeadline.classList.remove("entering")
      newHeadline.classList.add("active")

      // Remove old headlines after animation completes
      setTimeout(() => {
        const oldHeadlines = headlineContainer.querySelectorAll(".headline-text.exiting")
        oldHeadlines.forEach((el) => el.remove())
      }, 800)
    }, 50)
  }

  // Update resume content
  container.innerHTML = generateResumeHTML(content)

  // Restore open state for sections that were previously open
  Object.keys(openSections).forEach((sectionId) => {
    if (openSections[sectionId]) {
      // Find the corresponding section in the new language
      const newSection = document.getElementById(sectionId)
      if (newSection) {
        const details = newSection.querySelector("details")
        if (details) {
          details.setAttribute("open", "")
        }
      }
    }
  })
}

// Add this function to initialize the page
function initPage() {
  document.getElementById("lang-en").addEventListener("click", () => {
    renderResume("en")
  })

  document.getElementById("lang-jp").addEventListener("click", () => {
    renderResume("jp")
  })

  // Initialize with English content
  renderResume("en")

  // Set last updated date
  const lastUpdatedElement = document.getElementById("lastUpdated")
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = "Last Updated: " + new Date(document.lastModified).toLocaleDateString()
  }
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", initPage)
