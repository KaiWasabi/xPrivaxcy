const elts = {
    name: document.getElementById("name"), // Name
    education: document.getElementById("education"), // Education Section
    workHistory: document.getElementById("workHistory"), // Work History
    awards: document.getElementById("awards"), // Awards
    certifications: document.getElementById("certifications"), // Certifications
    publications: document.getElementById("publications"), // Publications
    educationTitle: document.getElementById("educationTitle"), // Education Heading
    workHistoryTitle: document.getElementById("workHistoryTitle"), // Work History Heading
    awardsTitle: document.getElementById("awardsTitle"), // Awards Heading
    certificationsTitle: document.getElementById("certificationsTitle"), // Certifications Heading
    publicationsTitle: document.getElementById("publicationsTitle"), // Publications Heading
  };
  
  // Clear the existing content to prevent mixing languages
  function clearContent() {
    elts.name.innerHTML = '';
    elts.education.innerHTML = '';
    elts.workHistory.innerHTML = '';
    elts.awards.innerHTML = '';
    elts.certifications.innerHTML = '';
    elts.publications.innerHTML = '';
    elts.educationTitle.innerHTML = '';
    elts.workHistoryTitle.innerHTML = '';
    elts.awardsTitle.innerHTML = '';
    elts.certificationsTitle.innerHTML = '';
    elts.publicationsTitle.innerHTML = '';
  }
  
  // Resume content in English
  const englishContent = {
    name: "Kai Watanabe",
    educationTitle: "Education",
    education: [
      "LL.B., Australian National University, 2024 - Present.",
      "Coursework for B.A. Criminal Justice, Pennsylvania State University, 2022 - 2023."
    ],
    workHistoryTitle: "Work History",
    workHistory: [
      "Secretary General for ANU Japan Club 2024 - Present.",
      "ANU Students' Association, Disputes Committee 2024 - Present",
      "TEDxYouth@Canberra, Marketing Associate 2024 - Present",
      "The Pennsylvania State University, Research Assistant 2022-2023"
    ],
    awardsTitle: "Awards",
    awards: [
      "President Walker Medalion, Pennsylvania State University, 2023",
      "Sigma Xi Behrend Competition, 2nd Place, 2023",
      "Spring Deans List, Pennsylvania State University, 2023",
      "Fall Deans List, Pennsylvania State University, 2023"
    ],
    certificationsTitle: "Certifications",
    certifications: [
      "ACT Responsible Service of Alcohol",
      "INFOSEC Privacy Fundamentals",
      "Google Cybersecurity Specialization",
      "CITI Social and Behavioral Human Subject Research Course Certification"
    ],
    publicationsTitle: "Publications",
    publications: "Perception of Medication for Opioid Use Disorder (doi:10.26207/ec8b-2752)"
  };
  
  // Resume content in Japanese
  const japaneseContent = {
    name: "渡部　帆",
    educationTitle: "学歴",
    education: [
      "法学士号、オーストラリア国立大学、2024年〜現在.",
      "刑事司法学、ペンシルバニア州立大学、2022年〜2023年"
    ],
    workHistoryTitle: "職歴",
    workHistory: [
      "豪州国立大日本クラブ、事務局長・書記官、2024年〜現在",
      "豪州国立大学生自治会, 紛争審判委員 2024年〜現在",
      "TEDxYouth@Canberra, マーケティングアソシエイト 2024年〜現在",
      "ペンシルベニア州立大学,　研究助手　2023年〜2024年"
    ],
    awardsTitle: "受賞歴",
    awards: [
      "ペンシルバニア州立大学、ウォーカー学長賞、2023年",
      "シグマ・サイ・ベーレンド研究学会 2位",
      "春学期 ペンシルベニア州立大学 学長表彰リスト、2023年",
      "秋学期 ペンシルベニア州立大学 学長表彰リスト、2023年"
    ],
    certificationsTitle: "認定資格",
    certifications: [
      "ACT アルコール適正提供資格",
      "INFOSEC プライバシー基礎講座",
      "Google サイバーセキュリティ専門資格",
      "CITI 社会・行動科学における人体研究コース修了認定"
    ],
    publicationsTitle: "研究・出版物",
    publications: "オピオイド使用障害に対する薬物治療の認識 (doi:10.26207/ec8b-2752)"
  };
  
  // Typing function for single line
  function typeText(element, text, callback, speed = 20) {
    let i = 0;
    function typing() {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1) + "<span id='cursor'>|</span>";
        i++;
        setTimeout(typing, speed);
      } else {
        element.innerHTML = text; // Remove cursor after typing finishes
        callback();
      }
    }
    typing();
  }
  
  // Typing function for multiple lines
  function typeMultipleLines(element, lines, speed = 20) {
    let lineIndex = 0;
  
    function typeNextLine() {
      if (lineIndex < lines.length) {
        const newLine = document.createElement('div'); // Create a new line for each entry
        element.appendChild(newLine);
        typeText(newLine, lines[lineIndex], () => {
          lineIndex++;
          setTimeout(typeNextLine, 100); // Short pause between lines
        }, speed);
      }
    }
    typeNextLine();
  }
  
  // Function to type all sections with different speeds
  function typeMultipleSections(headerSpeed, contentSpeed) {
    const content = currentLanguage === "jp" ? japaneseContent : englishContent;
  
    // Set and type the section titles (headers)
    typeText(elts.educationTitle, content.educationTitle, () => {
      typeMultipleLines(elts.education, content.education, contentSpeed);
    }, headerSpeed);
    
    typeText(elts.workHistoryTitle, content.workHistoryTitle, () => {
      typeMultipleLines(elts.workHistory, content.workHistory, contentSpeed);
    }, headerSpeed);
    
    typeText(elts.awardsTitle, content.awardsTitle, () => {
      typeMultipleLines(elts.awards, content.awards, contentSpeed);
    }, headerSpeed);
    
    typeText(elts.certificationsTitle, content.certificationsTitle, () => {
      typeMultipleLines(elts.certifications, content.certifications, contentSpeed);
    }, headerSpeed);
    
    typeText(elts.publicationsTitle, content.publicationsTitle, () => {
      typeText(elts.publications, content.publications, () => {}, contentSpeed);
    }, headerSpeed);
  }
  
  // Display content for the selected language with different speeds for name, headers, and content
  function displayContent(language, nameSpeed, headerSpeed, contentSpeed) {
    clearContent(); // Ensure the previous content is cleared immediately
    const content = language === "jp" ? japaneseContent : englishContent;
  
    // Set and type the name first
    typeText(elts.name, content.name, () => {
      typeMultipleSections(headerSpeed, contentSpeed); // Type the sections after name is completed
    }, nameSpeed);
  }
  
  // Language switch event listeners
  document.getElementById("lang-en").addEventListener("click", () => {
    currentLanguage = "en";
    displayContent(currentLanguage, 40, 20, 10);  // Adjust typing speeds as needed
  });
  
  document.getElementById("lang-jp").addEventListener("click", () => {
    currentLanguage = "jp";
    displayContent(currentLanguage, 100, 20, 10);  // Adjust typing speeds as needed
  });
  
  // Load default content in English on page load
  let currentLanguage = "en";
  displayContent(currentLanguage, 40, 20, 10);  // Adjust typing speeds as needed
  