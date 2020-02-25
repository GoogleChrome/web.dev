module.exports = {
  assessment: {
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
        stimulus: `Stimulus placeholder`,
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
    ],
  },
};
