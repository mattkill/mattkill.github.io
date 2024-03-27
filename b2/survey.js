const survey = {
    title: "Daily Happiness Survey",
    questions: [
        
        {
            questionId: "happiness",
            questionText: "How do you feel right now?",
            type: "slider",
            min: -50,
            max: 50,
            step: 0.1,
            expression: "true",
            endpoints: ["Very bad", "Very good"] // Slider endpoint labels
        },
        {
            questionId: "activities",
            questionText: "What are you doing right now?",
            type: "checkbox",
            options: [
                { value: "work", displayText: "Work" },
                { value: "leisure", displayText: "Leisure" },
                { value: "personalcare", displayText: "Personal Care" },
                {value: "other", displayText: "Other" }
                // Add more options as needed
            ],
            expression: "true" // Placeholder for any conditional logic
        },
        {
            questionId: "talking",
            questionText: "Are you currently talking or interacting with anyone?",
            type: "multipleChoice",
            options: [
                { value: "Yes", displayText: "Yes" },
                { value: "No", displayText: "No" }
            ],
            expression: "true"
        },
        {
            questionId: "doingfocused15mins",
            questionText: "Over the past 15 minutes, what percentage of the time have you been focused entirely on what you were doing?",
            type: "slider",
            min: 0,
            max: 100,
            step: 0.1,
            expression: "true",
            endpoints: ["0%", "100%"] // Slider endpoint labels
        },
    ]
};

let currentQuestionIndex = 0;
let answers = {};

function renderQuestion(questionIndex) {
    const question = survey.questions[questionIndex];
    const container = document.getElementById('surveyContainer');
    container.innerHTML = '';

    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = question.questionText;
    container.appendChild(questionText);

    if (question.type === 'multipleChoice') {
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option.displayText;
            button.onclick = () => {
                answers[question.questionId] = option.value;
                goToNextQuestion();
            };
            container.appendChild(button);
        });
    } else if (question.type === 'slider') {
       
        
        // Slider input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'slider';
        slider.min = question.min;
        slider.max = question.max;
        slider.step = question.step;

        slider.addEventListener('input', function() {
            this.classList.add('active'); // Add 'active' class to make the thumb visible
            answers[question.questionId] = this.value; // Store the slider value
        });

        container.appendChild(slider);

        slider.oninput = () => {
            answers[question.questionId] = slider.value;
        };

        // Slider label container
        const labelContainer = document.createElement('div');
        labelContainer.className = 'slider-labels';
        const minLabel = document.createElement('span');
        minLabel.textContent = question.endpoints[0]; // Min label
        const maxLabel = document.createElement('span');
        maxLabel.textContent = question.endpoints[1]; // Max label
        labelContainer.appendChild(minLabel);
        labelContainer.appendChild(maxLabel);
        container.appendChild(labelContainer);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.textContent = 'Next';
        nextButton.onclick = goToNextQuestion;
        container.appendChild(nextButton);  // The Next button is always shown for slider questions
    }
    else if (question.type === 'checkbox') {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-container';
    
        question.options.forEach(option => {
            const optionLabel = document.createElement('label');
            optionLabel.className = 'checkbox-option';
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option.value;
            
            // Append the checkbox and its text to the label
            optionLabel.appendChild(checkbox);
            optionLabel.append(" " + option.displayText); // Add a space before the text for better readability
    
            optionsContainer.appendChild(optionLabel);
        });
    
        container.appendChild(optionsContainer);
        
        // Always display the 'Next' button for checkbox questions
        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            // Gather all selected checkbox values
            const selectedValues = [];
            const checkboxes = optionsContainer.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                selectedValues.push(checkbox.value);
            });
            answers[question.questionId] = selectedValues;
            goToNextQuestion();
        };
        container.appendChild(nextButton);
    }
}

function goToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < survey.questions.length) {
        renderQuestion(currentQuestionIndex);
    } else {
        endSurvey();
    }
}

    // just for testing, show choices. will delete that part in the future.
function endSurvey() {
    const container = document.getElementById('surveyContainer');
    container.innerHTML = ''; // Clear the container

    // Create and append a thank you message
    const thankYouMessage = document.createElement('p');
    thankYouMessage.textContent = 'Thank you for completing the survey! Here are your responses:';
    container.appendChild(thankYouMessage);

    // Create a list to display the responses
    const responseList = document.createElement('ul');
    container.appendChild(responseList);

    // Iterate over the answers object and display each response
    for (const [questionId, answer] of Object.entries(answers)) {
        const listItem = document.createElement('li');
        const question = survey.questions.find(q => q.questionId === questionId).questionText;

        // Format the answer, considering it might be an array for checkbox questions
        const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : answer;
        
        listItem.textContent = `${question}: ${formattedAnswer}`;
        responseList.appendChild(listItem);
    }
}


// Start the survey by rendering the first question
renderQuestion(currentQuestionIndex);
