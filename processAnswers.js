async function processTextFile(filePath) {
    try {
        // Fetch the text file
        const response = await fetch(filePath);
        const text = await response.text();

        // Split the text into sections based on the delimiter
        const sections = text.split('######DELIMETER######');

        // Initialize an array to store the questions and answers
        const questionsAndAnswers = [];

        // Loop through each section
        sections.forEach(section => {
            // Trim the section to remove any leading/trailing whitespace
            section = section.trim();

            // Split each section into lines (the first line is the question, the rest are answers)
            const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            if (lines.length > 0) {
                const question = lines[0]; // The first line is the question
                const answers = lines.slice(1); // The rest are the answers

                // Create a JSON object with the question and its answers
                const questionObject = {
                    question: question,
                    answers: answers
                };

                // Add the object to the array
                questionsAndAnswers.push(questionObject);
            }
        });

        // Return the resulting array of JSON objects
        return questionsAndAnswers;

    } catch (error) {
        console.error('Error reading the file:', error);
        return [];
    }
}

let questionAndAnswers
async function loadQuestions() {
    questionAndAnswers = await processTextFile('answers.txt');
    console.log(questionAndAnswers); // Now you have the processed data
    // You can use the 'questions' variable here
}

// Call the function to load and process the questions
loadQuestions();
