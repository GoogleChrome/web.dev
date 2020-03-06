module.exports = {
  assessment: {
    // The setLeader is a description of the assessment set as a whole.
    // It appears beneath the callout header.
    // You can omit the setLeader if there's only one question in the set.
    // (One-question sets will ignore it if you accidentally include it.)
    setLeader: "Test your knowledge of resource optimization",
    // The height parameter is optional. It specifies the height of the callout.
    // Default height is 40rem.
    height: "25rem",
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
  },
};
