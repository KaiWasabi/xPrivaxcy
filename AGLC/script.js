// Generate citation based on the selected source type and inputs
function generateCitation() {
    const sourceType = document.getElementById('source-type').value;
    let citation = '';

    if (sourceType === 'case') {
        const caseName = document.getElementById('case-name').value.trim();
        const reportSeries = document.getElementById('case-report').value.trim();
        const year = document.getElementById('case-year').value.trim();
        const volume = document.getElementById('case-volume').value.trim();
        const startingPage = document.getElementById('case-page').value.trim();
        const court = document.getElementById('case-court').value.trim();
        const pinpointPage = document.getElementById('case-pinpoint-page').value.trim();
        const pinpointParagraph = document.getElementById('case-pinpoint-paragraph').value.trim();

        // Determine if the court should be included based on the report series
        let includeCourt = true;
        const reportSeriesLower = reportSeries.toLowerCase();

        if (reportSeriesLower.includes('clr') || reportSeriesLower.includes('nswlr')) {
            includeCourt = false;
        }

        // Construct citation
        if (caseName && reportSeries && year && volume && startingPage) {
            citation = `${caseName} (${year}) ${volume} ${reportSeries} ${startingPage}`;
            if (document.getElementById('case-pinpoint-toggle').checked) {
                if (pinpointPage) citation += `, ${pinpointPage}`;
                if (pinpointParagraph) citation += ` [${pinpointParagraph}]`;
            }
            if (includeCourt && court) {
                citation += ` (${court})`; // Only add court if required
            }
        }
    } else if (sourceType === 'book') {
        const author = document.getElementById('book-author').value.trim();
        const title = document.getElementById('book-title').value.trim();
        const edition = document.getElementById('book-edition').value.trim();
        const year = document.getElementById('book-year').value.trim();
        const publisher = document.getElementById('book-publisher').value.trim();
        const pinpointPage = document.getElementById('book-pinpoint-page').value.trim();

        if (author && title && year && publisher) {
            citation = `${author}, *${title}* (${edition ? edition + ' ed, ' : ''}${publisher}, ${year})`;
            if (document.getElementById('book-pinpoint-toggle').checked && pinpointPage) {
                citation += ` ${pinpointPage}`;
            }
            citation += `.`;
        }
    } else if (sourceType === 'journal') {
        const author = document.getElementById('journal-author').value.trim();
        const title = document.getElementById('journal-title').value.trim();
        const journalName = document.getElementById('journal-name').value.trim();
        const volume = document.getElementById('journal-volume').value.trim();
        const year = document.getElementById('journal-year').value.trim();
        const startingPage = document.getElementById('journal-page').value.trim();
        const pinpointPage = document.getElementById('journal-pinpoint-page').value.trim();

        if (author && title && journalName && volume && year && startingPage) {
            citation = `${author}, '${title}' (${year}) ${volume} *${journalName}* ${startingPage}`;
            if (document.getElementById('journal-pinpoint-toggle').checked && pinpointPage) {
                citation += `, ${pinpointPage}`;
            }
            citation += `.`;
        }
    } else if (sourceType === 'legislation') {
        const title = document.getElementById('legislation-title').value.trim();
        const year = document.getElementById('legislation-year').value.trim();
        const jurisdiction = document.getElementById('legislation-jurisdiction').value.trim();
        const pinpointSection = document.getElementById('legislation-pinpoint-section').value.trim();
        const pinpointSubsection = document.getElementById('legislation-pinpoint-subsection').value.trim();

        if (title && year && jurisdiction) {
            citation = `${title} ${year} (${jurisdiction})`;
            if (document.getElementById('legislation-pinpoint-toggle').checked) {
                if (pinpointSection) citation += ` s ${pinpointSection}`;
                if (pinpointSubsection) citation += `(${pinpointSubsection})`;
            }
            citation += `.`;
        }
    } else if (sourceType === 'website') {
        const author = document.getElementById('website-author').value.trim();
        const title = document.getElementById('website-title').value.trim();
        const websiteName = document.getElementById('website-name').value.trim();  // Added Website Name field
        const url = document.getElementById('website-url').value.trim();
        const accessDate = document.getElementById('website-access-date').value.trim();

        if (title && websiteName && url && accessDate) {  // Include websiteName in the condition
            citation = `${author ? author + ', ' : ''}'${title}', *${websiteName}* (${new Date(accessDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}) <${url}>.`;
        }
    }

    document.getElementById('generated-citation').textContent = citation;
}

// Save the generated citation
function saveCitation() {
    const citation = document.getElementById('generated-citation').textContent;
    if (citation && citation.trim() !== "") {
        let citations = JSON.parse(localStorage.getItem('citations')) || [];
        citations.push(citation);
        localStorage.setItem('citations', JSON.stringify(citations));
        displaySavedCitations();
    } else {
        alert('Cannot save an empty citation.');
    }
}

// Display saved citations
function displaySavedCitations() {
    const citations = JSON.parse(localStorage.getItem('citations')) || [];
    const citationList = document.getElementById('citation-list');
    citationList.innerHTML = '';
    citations.forEach((citation) => {
        const li = document.createElement('li');
        li.textContent = citation;
        citationList.appendChild(li);
    });
}

// Export saved citations as a text file
function exportCitations() {
    const citations = JSON.parse(localStorage.getItem('citations')) || [];
    if (citations.length > 0) {
        const blob = new Blob([citations.join('\n')], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'citations.txt';
        a.click();
    } else {
        alert('No citations to export.');
    }
}

// Clear saved citations
function clearCitations() {
    if (confirm('Are you sure you want to clear all saved citations?')) {
        localStorage.removeItem('citations');
        displaySavedCitations();
    }
}

// Toggle Pinpoint Fields
function togglePinpoint(checkboxId, pinpointFieldsId) {
    const checkbox = document.getElementById(checkboxId);
    const pinpointFields = document.getElementById(pinpointFieldsId);
    checkbox.addEventListener('change', function() {
        pinpointFields.style.display = checkbox.checked ? 'block' : 'none';
    });
}

// Privacy Policy Modal
document.getElementById('privacy-policy-link').addEventListener('click', function() {
    document.getElementById('privacy-policy-modal').style.display = 'flex';
});

function closePrivacyPolicy() {
    document.getElementById('privacy-policy-modal').style.display = 'none';
}

// Equity Statement Modal
document.getElementById('equity-statement-link').addEventListener('click', function() {
    document.getElementById('equity-statement-modal').style.display = 'flex';
});

function closeEquityStatement() {
    document.getElementById('equity-statement-modal').style.display = 'none';
}

// Event listeners for form elements
document.getElementById('source-type').addEventListener('change', function () {
    document.querySelectorAll('.citation-fields').forEach(function (field) {
        field.style.display = 'none';
    });

    const selectedSourceType = this.value + '-fields';
    if (document.getElementById(selectedSourceType)) {
        document.getElementById(selectedSourceType).style.display = 'block';
    }
});

// Initialize Pinpoint Fields toggle
togglePinpoint('case-pinpoint-toggle', 'case-pinpoint-fields');
togglePinpoint('book-pinpoint-toggle', 'book-pinpoint-fields');
togglePinpoint('journal-pinpoint-toggle', 'journal-pinpoint-fields');
togglePinpoint('legislation-pinpoint-toggle', 'legislation-pinpoint-fields');

// Display saved citations on page load
displaySavedCitations();
