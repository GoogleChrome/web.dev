module.exports = {
  assessments: [
    {
      // The setLeader is a description of the assessment set as a whole.
      // It appears beneath the callout header.
      // You can omit the setLeader if there's only one question in the set.
      // (One-question sets will ignore it if you accidentally include it.)
      setLeader: "Test your knowledge of resource optimization",
      // The height parameter is optional. It specifies the height of the callout.
      // Default height is 40rem.
      height: "38rem",
      // You can adjust the labels for the question tabs using tabLabel.
      // There are three options:
      // --"question" (default): Creates an auto-numbered "Question n" label.
      //    Use for sets that mostly ask users to submit a response.
      // --"sample": Creates an auto-numbered "Sample n" label.
      //    Use for sets composed mostly of think-and-checks.
      // --"bare": Creates an auto-numbered "n" label.
      //    Use for larger sets where horizontal space is limited.
      tabLabel: "question",
      questions: [
        // Available question types:
        // --"multiple-choice"
        // --"think-and-check"
        {
          // The stimulus is optional. It appears at the top of the question.
          // There is only one stimulus per question,
          // no matter how many components the question has.
          //
          // Note: you must remove leading whitespace to get MarkDown to behave :(
          stimulus: `\`\`\`html
<label for="pwd-input">Password</label>
<input type="text" role="textbox" id="pwd-input" name="password">
\`\`\``,
          // This is a think-and-check question.
          // Think-and-checks will ignore cardinality, correctAnswers,
          // and any option content
          // because the question type doesn't allow responses.
          type: "think-and-check",
          stem: "Does the sample need ARIA?",
          options: [
            {
              rationale: `**No.** This sample is **incorrect**.
                Since the text input is a native HTML form element,
                it doesn't need ARIA for its semantics.
                To fix the sample, remove the \`role\` attribute from the \`<input>\`
                element.`,
            },
          ],
        },
        {
          // This is a single-select multiple-choice question.
          type: "multiple-choice",
          cardinality: "1",
          correctAnswers: "0",
          stem: "When is it appropriate to lazy load an image?",
          options: [
            {
              content: "When the image is offscreen during initial page load.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "When the image is a PNG or JPG.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "When the image has a `lazyload` class.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "When the image is larger than 10&nbsp;KB.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
          ],
        },
        {
          // This is a multiple-select multiple-choice question with two correct answers.
          type: "multiple-choice",
          cardinality: "1+",
          correctAnswers: "1,3",
          stem: `Which statements about optimizing third-party resources are
            accurate?`,
          options: [
            {
              content: `The \`async\` and \`defer\` attributes can be used
                interchangeably.`,
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "Pre-connecting to resources is sometimes appropriate.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "Lazy-loading ads should typically be avoided.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "Resources that don't provide value should be removed.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
            {
              content: "Self-hosting resources requires minimal maintenance.",
              rationale: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            },
          ],
        },
        {
          // This is a multiple-select multiple-choice question presented in two columns.
          type: "multiple-choice",
          cardinality: "1+",
          correctAnswers: "1,4",
          stem: "Which **two** Sesame Street muppets are clearly the best?",
          columns: true,
          options: [
            {
              content: "![Elmo](./elmo.jpg)",
              rationale: `Don't give a second thought to this tickle-me-come-lately.`,
            },
            {
              content: "![Ernie](./ernie.jpg)",
              rationale: `I mean, c'mon. He's Ernie. I don't know🤷`,
            },
            {
              content: "![Cookie Monster](./cookiemonster.jpg)",
              rationale: `"[A cookie is a sometimes food](https://youtu.be/PaHkwE7TaNg)"?
                I remember when you had integrity.`,
            },
            {
              content: "![Big Bird](./bigbird.jpg)",
              rationale: `Laying it on kinda thick with the wide-eyed childlike wonder, no?`,
            },
            {
              content: "![Grover](./grover.jpg)",
              rationale: `The OG monster. Never forget it.`,
            },
          ],
        },
        {
          stimulus: "![Webby](./webby.png)",
          // This is a composite question; it has two response components.
          // For composite questions, add a "components" key
          // and include all question data EXCEPT the stimulus in each component.
          components: [
            {
              type: "multiple-choice",
              cardinality: "1",
              correctAnswers: "0",
              stem: "Is Webby awesome?",
              options: [
                {
                  content: "Yes",
                  rationale: `Webby is _everything_.`,
                },
                {
                  content: "No",
                  rationale: `You monster! Just look at him!🤩`,
                },
              ],
            },
            {
              type: "multiple-choice",
              cardinality: "1",
              correctAnswers: "0",
              stem: "Just _how_ awesome is Webby?",
              options: [
                {
                  content: "Pretty awesome",
                  rationale: `Incorrect.`,
                },
                {
                  content: "The awesomest",
                  rationale: `Close but no.`,
                },
                {
                  content: "OMG 🤯",
                  rationale: `It was always you, Webby.`,
                },
              ],
            },
          ],
        }, // Last question ends here
      ],
    }, // First assessment ends here
  ],
};
