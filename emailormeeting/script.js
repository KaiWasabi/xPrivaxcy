// Initialize particles after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Check if particlesJS is already defined (e.g., by an external library)
    if (typeof particlesJS === "undefined") {
      // If not, you might want to load it dynamically or provide a default
      console.warn("particlesJS is not defined. Ensure the library is included.")
      // You could also define a no-op function to prevent errors:
      window.particlesJS = () => {}
    }
  
    // Full-page particles configuration - matching main site
    if (typeof particlesJS !== "undefined") {
      particlesJS("particles-js", {
        particles: {
          number: {
            value: 30 /* Reduced for better performance */,
            density: { enable: true, value_area: 800 },
          },
          color: {
            value: ["#f5f5f7", "#a1a1a6", "#d2d2d7"],
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
          },
          opacity: {
            value: 0.3,
            random: true,
            anim: {
              enable: true,
              speed: 0.3,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 2,
            random: true,
            anim: {
              enable: true,
              speed: 0.5,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#a1a1a6",
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8 /* Reduced for better performance */,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 0.4,
              },
            },
            push: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      })
    }
  
    // Assessment functionality
    const form = document.getElementById("meetingAssessment")
    const submitButton = document.getElementById("submitButton")
    const prevButton = document.getElementById("prevButton")
    const nextButton = document.getElementById("nextButton")
    const progressBar = document.getElementById("progressBar")
    const progressText = document.getElementById("progressText")
    const totalQuestions = document.querySelectorAll(".question-container").length
  
    // Make these variables global so they can be accessed by resetAssessment
    window.currentQuestion = 1
    window.answeredQuestions = new Set()
  
    // Show the first question initially
    showQuestion(window.currentQuestion)
    updateProgressBar()
  
    // Function to show a specific question
    function showQuestion(questionNumber) {
      // Hide all questions
      document.querySelectorAll(".question-container").forEach((container) => {
        container.style.display = "none"
      })
  
      // Show the current question
      const currentQuestionElement = document.querySelector(`.question-container[data-question="${questionNumber}"]`)
      if (currentQuestionElement) {
        currentQuestionElement.style.display = "block"
      }
  
      // Update buttons state
      updateButtonStates()
  
      // Update progress text
      progressText.textContent = `Question ${questionNumber} of ${totalQuestions}`
    }
  
    // Function to update the progress bar
    function updateProgressBar() {
      const progress = (window.answeredQuestions.size / totalQuestions) * 100
      progressBar.style.width = `${progress}%`
    }
  
    // Function to update button states
    function updateButtonStates() {
      // Previous button is disabled on first question
      prevButton.disabled = window.currentQuestion === 1
  
      // Next button is enabled if current question is answered
      nextButton.disabled = !window.answeredQuestions.has(window.currentQuestion)
  
      // Show submit button only on the last question and if all questions are answered
      if (window.currentQuestion === totalQuestions) {
        if (window.answeredQuestions.size === totalQuestions) {
          submitButton.style.display = "block"
          submitButton.disabled = false
        } else {
          submitButton.style.display = "none"
        }
        nextButton.style.display = "none"
      } else {
        submitButton.style.display = "none"
        nextButton.style.display = "inline-block"
      }
    }
  
    // Listen for radio button changes
    form.addEventListener("change", (e) => {
      if (e.target.type === "radio") {
        // Mark current question as answered
        window.answeredQuestions.add(window.currentQuestion)
  
        // Update progress
        updateProgressBar()
  
        // Enable next button
        updateButtonStates()
      }
    })
  
    // Previous button click handler
    prevButton.addEventListener("click", () => {
      if (window.currentQuestion > 1) {
        window.currentQuestion--
        showQuestion(window.currentQuestion)
      }
    })
  
    // Next button click handler
    nextButton.addEventListener("click", () => {
      if (window.currentQuestion < totalQuestions) {
        window.currentQuestion++
        showQuestion(window.currentQuestion)
      }
    })
  
    // Submit button click handler
    submitButton.addEventListener("click", () => {
      // Calculate score
      let score = 0
      for (let i = 1; i <= totalQuestions; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`)
        if (selectedOption) {
          score += Number.parseInt(selectedOption.value)
        }
      }
  
      // Hide the form
      form.style.display = "none"
      document.querySelector(".progress-container").style.display = "none"
      document.querySelector(".progress-text").style.display = "none"
      document.querySelector(".navigation-buttons").style.display = "none"
  
      // Show the appropriate result
      const avgScore = score / totalQuestions
      if (avgScore < 2) {
        document.getElementById("resultEmail").style.display = "block"
      } else if (avgScore < 3) {
        document.getElementById("resultDepends").style.display = "block"
      } else {
        document.getElementById("resultMeeting").style.display = "block"
      }
    })
  })
  
  // Reset the assessment
  function resetAssessment() {
    // Reset the form
    document.getElementById("meetingAssessment").reset()
    document.getElementById("meetingAssessment").style.display = "block"
  
    // Show UI elements
    document.querySelector(".progress-container").style.display = "block"
    document.querySelector(".progress-text").style.display = "block"
    document.querySelector(".navigation-buttons").style.display = "flex"
  
    // Reset progress bar
    document.getElementById("progressBar").style.width = "0"
    document.getElementById("progressText").textContent = "Question 1 of 10"
  
    // Hide buttons initially
    document.getElementById("submitButton").style.display = "none"
    document.getElementById("nextButton").style.display = "inline-block"
    document.getElementById("nextButton").disabled = true
    document.getElementById("prevButton").disabled = true
  
    // Hide results
    document.getElementById("resultEmail").style.display = "none"
    document.getElementById("resultDepends").style.display = "none"
    document.getElementById("resultMeeting").style.display = "none"
  
    // Reset to first question
    document.querySelectorAll(".question-container").forEach((container, index) => {
      container.style.display = index === 0 ? "block" : "none"
    })
  
    // Reset tracking variables
    window.currentQuestion = 1
    window.answeredQuestions = new Set()
  }
  