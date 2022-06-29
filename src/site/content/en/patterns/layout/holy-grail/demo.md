---
patternId: layout/holy-grail
layout: demo
---

<style>
  :root {
    --coral: hsl(300, 100%, 93%);
    --coral--b: hsl(280, 100%, 70%);
    --blue: hsl(200, 100%, 90%);
    --blue--b: hsl(200, 100%, 80%);
    --green: hsl(113, 85%, 95%);
    --green--b: hsl(84, 71%, 53%);
    --yellow: hsl(30, 100%, 93%);
    --yellow--b: hsl(40, 100%, 80%);
    --page-padding: 1rem;
  }

  body {
    font-family: system-ui, serif;
    display: grid;
    align-items: center;
    height: 100%;
  }

  .box {
    font-size: 2rem;
    padding: 1rem;
    display: grid;
    place-items: center;
    border-radius: 1rem;
    border-style: dashed;
    background-color: var(--coral);
    border: 1px solid var(--coral--b);
  }

  .coral {
    background-color: var(--coral);
    border: 1px solid var(--coral--b);
  }

  .yellow {
    background-color: var(--yellow);
    border: 1px solid var(--yellow--b);
  }

  .blue,
  .card {
    background-color: var(--blue);
    border: 1px solid var(--blue--b);
  }

  .green,
  .visual {
    background-color: var(--green);
    border: 1px solid var(--green--b);
  }

  .section {
    font-size: 1.5rem;
    padding: 1rem;
    border-style: dashed;
  }

  .parent {
    height: 100%;
  }

  /* Warning */
  .warning {
    max-width: 460px;
    margin: 0 auto 2rem;
    background: #ffcebf;
    border: 1px solid tomato;
    padding: 1rem;
  }

  h1 + h2 {
    margin-top: -1rem;
  }

  button {
    border: none;
    padding: 0.5rem;
    background: var(--coral);
    border: 1px solid var(--coral--b);
    font-weight: 600;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
  }

  @supports (container: inline-size) {
    .warning {
      display: none;
    }
  }
</style>