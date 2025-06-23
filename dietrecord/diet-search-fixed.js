class DietRecordsSearch {
  constructor() {
    // Use multiple CORS proxy services as fallbacks
    this.proxyServices = [
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?",
      "https://cors-anywhere.herokuapp.com/",
    ]
    this.currentProxyIndex = 0
    this.baseUrl = "https://kokkai.ndl.go.jp/api/"
    this.currentPage = 1
    this.recordsPerPage = 30
    this.totalRecords = 0
    this.currentSearchParams = null
    this.isSearching = false
    this.deepSeekApiKey = null // Will be set if user provides API key

    this.initializeEventListeners()
    this.loadApiKey()
  }

  loadApiKey() {
    // Try to load DeepSeek API key from localStorage
    this.deepSeekApiKey = localStorage.getItem("deepseek_api_key")
    if (!this.deepSeekApiKey) {
      // Prompt user for API key if they want to use AI features
      const useAI = confirm(
        "To use AI analysis features, you need a DeepSeek API key. Would you like to enter one now?",
      )
      if (useAI) {
        const apiKey = prompt("Please enter your DeepSeek API key:")
        if (apiKey) {
          this.deepSeekApiKey = apiKey
          localStorage.setItem("deepseek_api_key", apiKey)
        }
      }
    }
  }

  initializeEventListeners() {
    const form = document.getElementById("dietSearchForm")
    const clearButton = document.getElementById("clearButton")
    const retryButton = document.getElementById("retryButton")
    const prevPageBtn = document.getElementById("prevPage")
    const nextPageBtn = document.getElementById("nextPage")
    const searchTypeSelect = document.getElementById("searchType")

    form.addEventListener("submit", (e) => this.handleSearch(e))
    clearButton.addEventListener("click", () => this.clearForm())
    retryButton.addEventListener("click", () => this.retrySearch())
    prevPageBtn.addEventListener("click", () => this.goToPreviousPage())
    nextPageBtn.addEventListener("click", () => this.goToNextPage())
    searchTypeSelect.addEventListener("change", () => this.updateMaxRecordsOptions())
  }

  updateMaxRecordsOptions() {
    const searchType = document.getElementById("searchType").value
    const maxRecordsSelect = document.getElementById("maxRecords")

    // Clear existing options
    maxRecordsSelect.innerHTML = ""

    if (searchType === "meeting") {
      // Meeting output has max 10 records
      const options = [
        { value: "3", text: "3 results", selected: true },
        { value: "5", text: "5 results" },
        { value: "10", text: "10 results" },
      ]
      options.forEach((opt) => {
        const option = document.createElement("option")
        option.value = opt.value
        option.textContent = opt.text
        if (opt.selected) option.selected = true
        maxRecordsSelect.appendChild(option)
      })
    } else {
      // Meeting list and speech output have max 100 records
      const options = [
        { value: "10", text: "10 results" },
        { value: "30", text: "30 results", selected: true },
        { value: "50", text: "50 results" },
        { value: "100", text: "100 results" },
      ]
      options.forEach((opt) => {
        const option = document.createElement("option")
        option.value = opt.value
        option.textContent = opt.text
        if (opt.selected) option.selected = true
        maxRecordsSelect.appendChild(option)
      })
    }
  }

  async handleSearch(event) {
    event.preventDefault()

    if (this.isSearching) return

    const formData = new FormData(event.target)
    const searchParams = this.buildSearchParams(formData)

    // Validate that at least one search parameter is provided
    if (!this.hasValidSearchParams(searchParams)) {
      this.showError(
        "Please provide at least one search parameter (keywords, speaker, meeting name, date range, or session range).",
      )
      return
    }

    this.currentSearchParams = searchParams
    this.currentPage = 1

    await this.performSearch()
  }

  buildSearchParams(formData) {
    const params = new URLSearchParams()

    // Add all form fields to params
    for (const [key, value] of formData.entries()) {
      if (value && value.trim() !== "" && !["searchType", "enableAI", "analysisType"].includes(key)) {
        params.append(key, value.trim())
      }
    }

    // Always add JSON format
    params.append("recordPacking", "json")

    return params
  }

  hasValidSearchParams(params) {
    const requiredParams = [
      "any",
      "speaker",
      "nameOfMeeting",
      "from",
      "until",
      "sessionFrom",
      "sessionTo",
      "speakerPosition",
      "speakerGroup",
      "speakerRole",
    ]
    return requiredParams.some((param) => params.has(param))
  }

  async performSearch() {
    this.showLoading()
    this.hideError()
    this.hideResults()

    try {
      const searchType = document.getElementById("searchType").value
      const startRecord = (this.currentPage - 1) * this.recordsPerPage + 1

      // Add pagination parameters
      const searchParams = new URLSearchParams(this.currentSearchParams)
      searchParams.set("startRecord", startRecord.toString())

      // Construct the full API URL
      const apiUrl = `${this.baseUrl}${searchType}?${searchParams.toString()}`

      console.log("Searching with URL:", apiUrl)

      const data = await this.fetchWithFallback(apiUrl)

      if (data.message) {
        // API returned an error
        throw new Error(data.message + (data.details ? ": " + data.details.join(", ") : ""))
      }

      await this.displayResults(data, searchType)
    } catch (error) {
      console.error("Search error:", error)
      this.showError(this.getErrorMessage(error))
    } finally {
      this.hideLoading()
    }
  }

  async fetchWithFallback(apiUrl) {
    let lastError = null

    // Try each proxy service
    for (let i = 0; i < this.proxyServices.length; i++) {
      try {
        const proxyUrl = `${this.proxyServices[i]}${encodeURIComponent(apiUrl)}`
        console.log(`Trying proxy ${i + 1}:`, proxyUrl)

        const response = await fetch(proxyUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()

        // Try to parse as JSON
        try {
          return JSON.parse(responseText)
        } catch (parseError) {
          if (responseText.includes("<?xml")) {
            throw new Error("Received XML response instead of JSON. The API might be experiencing issues.")
          }
          throw new Error("Invalid response format received from the API.")
        }
      } catch (error) {
        console.warn(`Proxy ${i + 1} failed:`, error.message)
        lastError = error
        continue
      }
    }

    // If all proxies failed, throw the last error
    throw lastError || new Error("All proxy services failed")
  }

  getErrorMessage(error) {
    let errorMessage = "An error occurred while searching. "

    if (error.message.includes("Failed to fetch")) {
      errorMessage +=
        "This might be due to network connectivity issues or the API being temporarily unavailable. Please check your internet connection and try again."
    } else if (error.message.includes("CORS")) {
      errorMessage += "There was a cross-origin request issue. This is a browser security restriction."
    } else if (error.message.includes("timeout")) {
      errorMessage += "The request timed out. The API might be experiencing high traffic."
    } else if (error.message.includes("All proxy services failed")) {
      errorMessage += "All proxy services are currently unavailable. Please try again later."
    } else {
      errorMessage += error.message || "Please try again later."
    }

    return errorMessage
  }

  async displayResults(data, searchType) {
    this.totalRecords = data.numberOfRecords || 0
    const returnedRecords = data.numberOfReturn || 0

    // Update results info
    document.getElementById("resultsCount").textContent =
      `${this.totalRecords.toLocaleString()} total results, showing ${returnedRecords}`

    this.updatePagination()

    const resultsContent = document.getElementById("resultsContent")
    resultsContent.innerHTML = ""

    if (this.totalRecords === 0) {
      resultsContent.innerHTML = '<div class="no-results">No records found matching your search criteria.</div>'
      this.showResults()
      return
    }

    // Display results based on search type
    if (searchType === "speech") {
      await this.displaySpeechResults(data.speechRecord || [])
    } else {
      await this.displayMeetingResults(data.meetingRecord || [], searchType)
    }

    this.showResults()
  }

  async displaySpeechResults(speeches) {
    const resultsContent = document.getElementById("resultsContent")
    const enableAI = document.getElementById("enableAI").value === "true"
    const analysisType = document.getElementById("analysisType").value

    for (const speech of speeches) {
      const speechCard = document.createElement("div")
      speechCard.className = "result-card speech-result"

      let aiAnalysisHtml = ""
      if (enableAI && this.deepSeekApiKey && speech.speech) {
        try {
          this.showAILoading()
          const analysis = await this.analyzeWithDeepSeek(speech.speech, analysisType)
          aiAnalysisHtml = `
            <div class="ai-analysis" style="background-color: #f0f8ff; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #0071e3;">
              <strong>🤖 AI Analysis (${analysisType}):</strong>
              <div style="margin-top: 8px; font-style: italic;">${this.escapeHtml(analysis)}</div>
            </div>
          `
        } catch (error) {
          console.warn("AI analysis failed:", error)
          aiAnalysisHtml = `
            <div class="ai-analysis-error" style="background-color: #fff5f5; padding: 12px; border-radius: 6px; margin-top: 12px; border-left: 4px solid #e53e3e; color: #c53030;">
              <strong>⚠️ AI Analysis Failed:</strong> ${error.message}
            </div>
          `
        } finally {
          this.hideAILoading()
        }
      }

      speechCard.innerHTML = `
        <div class="result-header">
          <h3 class="result-title">
            <a href="${speech.speechURL}" target="_blank" rel="noopener noreferrer">
              ${this.escapeHtml(speech.speaker || "Unknown Speaker")} - Speech #${speech.speechOrder || "N/A"}
            </a>
          </h3>
          <div class="result-meta">
            <span class="session-info">Session ${speech.session || "N/A"}</span>
            <span class="date-info">${this.formatDate(speech.date)}</span>
            <span class="house-info">${this.escapeHtml(speech.nameOfHouse || "N/A")}</span>
          </div>
        </div>
        
        <div class="result-content">
          <div class="meeting-info">
            <strong>Meeting:</strong> ${this.escapeHtml(speech.nameOfMeeting || "N/A")}
            ${speech.issue ? `(Issue #${speech.issue})` : ""}
          </div>
          
          ${speech.speakerPosition ? `<div class="speaker-position"><strong>Position:</strong> ${this.escapeHtml(speech.speakerPosition)}</div>` : ""}
          ${speech.speakerGroup ? `<div class="speaker-group"><strong>Party/Group:</strong> ${this.escapeHtml(speech.speakerGroup)}</div>` : ""}
          
          ${
            speech.speech
              ? `
            <div class="speech-content">
              <strong>Speech Content:</strong>
              <div class="speech-text">${this.truncateText(this.escapeHtml(speech.speech), 500)}</div>
            </div>
          `
              : ""
          }
          
          ${aiAnalysisHtml}
        </div>
        
        <div class="result-actions">
          <a href="${speech.speechURL}" target="_blank" rel="noopener noreferrer" class="action-link">
            View Full Speech
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          ${
            speech.meetingURL
              ? `
            <a href="${speech.meetingURL}" target="_blank" rel="noopener noreferrer" class="action-link">
              View Meeting Record
            </a>
          `
              : ""
          }
        </div>
      `

      resultsContent.appendChild(speechCard)
    }
  }

  async displayMeetingResults(meetings, searchType) {
    const resultsContent = document.getElementById("resultsContent")

    for (const meeting of meetings) {
      const meetingCard = document.createElement("div")
      meetingCard.className = "result-card meeting-result"

      const speechCount = meeting.speechRecord ? meeting.speechRecord.length : 0
      const isFullMeeting = searchType === "meeting"

      meetingCard.innerHTML = `
        <div class="result-header">
          <h3 class="result-title">
            <a href="${meeting.meetingURL}" target="_blank" rel="noopener noreferrer">
              ${this.escapeHtml(meeting.nameOfMeeting || "Unknown Meeting")}
            </a>
          </h3>
          <div class="result-meta">
            <span class="session-info">Session ${meeting.session || "N/A"}</span>
            <span class="date-info">${this.formatDate(meeting.date)}</span>
            <span class="house-info">${this.escapeHtml(meeting.nameOfHouse || "N/A")}</span>
            ${meeting.issue ? `<span class="issue-info">Issue #${meeting.issue}</span>` : ""}
          </div>
        </div>
        
        <div class="result-content">
          ${
            speechCount > 0
              ? `
            <div class="speech-summary">
              <strong>${speechCount} speech${speechCount !== 1 ? "es" : ""} recorded</strong>
              ${isFullMeeting ? " (showing full content)" : " (showing summary)"}
            </div>
            
            <div class="speeches-container">
              ${meeting.speechRecord
                .slice(0, isFullMeeting ? speechCount : 3)
                .map(
                  (speech) => `
                <div class="speech-item">
                  <div class="speech-header">
                    <strong>${this.escapeHtml(speech.speaker || "Unknown")}</strong>
                    ${speech.speakerPosition ? `<span class="position">(${this.escapeHtml(speech.speakerPosition)})</span>` : ""}
                    <span class="speech-order">#${speech.speechOrder || "N/A"}</span>
                  </div>
                  ${
                    speech.speech && isFullMeeting
                      ? `
                    <div class="speech-content">
                      ${this.truncateText(this.escapeHtml(speech.speech), 300)}
                    </div>
                  `
                      : ""
                  }
                </div>
              `,
                )
                .join("")}
              
              ${
                !isFullMeeting && speechCount > 3
                  ? `
                <div class="more-speeches">
                  ... and ${speechCount - 3} more speeches
                </div>
              `
                  : ""
              }
            </div>
          `
              : '<div class="no-speeches">No speeches recorded for this meeting.</div>'
          }
        </div>
        
        <div class="result-actions">
          <a href="${meeting.meetingURL}" target="_blank" rel="noopener noreferrer" class="action-link">
            View Full Meeting Record
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          ${
            meeting.pdfURL
              ? `
            <a href="${meeting.pdfURL}" target="_blank" rel="noopener noreferrer" class="action-link">
              View PDF
            </a>
          `
              : ""
          }
        </div>
      `

      resultsContent.appendChild(meetingCard)
    }
  }

  async analyzeWithDeepSeek(speechText, analysisType) {
    if (!this.deepSeekApiKey) {
      throw new Error("DeepSeek API key not configured")
    }

    const prompts = {
      summary: "Please provide a concise summary of this Japanese parliamentary speech in English:",
      sentiment: "Please analyze the sentiment and tone of this Japanese parliamentary speech:",
      key_points: "Please extract the key points and main arguments from this Japanese parliamentary speech:",
      full_analysis:
        "Please provide a comprehensive analysis of this Japanese parliamentary speech, including summary, key points, sentiment, and political context:",
    }

    const prompt = prompts[analysisType] || prompts.summary

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.deepSeekApiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `${prompt}\n\n${speechText.substring(0, 4000)}`, // Limit text length
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || "Analysis not available"
    } catch (error) {
      throw new Error(`AI analysis failed: ${error.message}`)
    }
  }

  updatePagination() {
    const totalPages = Math.ceil(this.totalRecords / this.recordsPerPage)
    const prevBtn = document.getElementById("prevPage")
    const nextBtn = document.getElementById("nextPage")
    const pageInfo = document.getElementById("pageInfo")

    prevBtn.disabled = this.currentPage <= 1
    nextBtn.disabled = this.currentPage >= totalPages || this.totalRecords === 0

    if (this.totalRecords > 0) {
      pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`
    } else {
      pageInfo.textContent = "Page 1"
    }
  }

  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      await this.performSearch()
    }
  }

  async goToNextPage() {
    const totalPages = Math.ceil(this.totalRecords / this.recordsPerPage)
    if (this.currentPage < totalPages) {
      this.currentPage++
      await this.performSearch()
    }
  }

  async retrySearch() {
    if (this.currentSearchParams) {
      await this.performSearch()
    }
  }

  clearForm() {
    document.getElementById("dietSearchForm").reset()
    this.hideResults()
    this.hideError()
    this.currentSearchParams = null
    this.currentPage = 1
    this.updateMaxRecordsOptions()
  }

  showLoading() {
    this.isSearching = true
    document.getElementById("loadingIndicator").style.display = "block"
    document.getElementById("searchButton").disabled = true
  }

  hideLoading() {
    this.isSearching = false
    document.getElementById("loadingIndicator").style.display = "none"
    document.getElementById("searchButton").disabled = false
  }

  showAILoading() {
    document.getElementById("aiLoadingIndicator").style.display = "block"
  }

  hideAILoading() {
    document.getElementById("aiLoadingIndicator").style.display = "none"
  }

  showResults() {
    document.getElementById("resultsContainer").style.display = "block"
  }

  hideResults() {
    document.getElementById("resultsContainer").style.display = "none"
  }

  showError(message) {
    document.getElementById("errorMessage").textContent = message
    document.getElementById("errorContainer").style.display = "block"
  }

  hideError() {
    document.getElementById("errorContainer").style.display = "none"
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  formatDate(dateString) {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }
}

// Initialize the search functionality when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DietRecordsSearch()
})
