module.exports = {
  assessment: {
    // The setLeader is a description of the assessment set as a whole.
    // It appears beneath the callout header.
    // You can omit the setLeader if there's only one question in the set.
    // (It'll be ignored if you leave it in that case.)
    setLeader: "Test your knowledge of resource optimization",
    // The height parameter is optional. It specifies the height of the callout.
    // Default height is 40rem.
    height: "38rem",
    // tabLabel takes one of two values:
    // --"question": Creates an auto-numbered "Question n" label for each tab.
    //   Use "question" for sets that mostly ask users to submit a response.
    // --"sample": Creates an auto-numbered "Sample n" label for each tab.
    //   Use "sample" for sets composed mostly of think-and-checks.
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
        // Note: you must remove leading whitespace to get block formatting to work.
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
    ],
  },
};
