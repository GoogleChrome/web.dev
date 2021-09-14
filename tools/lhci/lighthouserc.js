module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm start',
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/blog/',
        'http://localhost:8080/measure/',
      ],
    },
    upload: {
      serverBaseUrl: process.env.LHCI_SERVER,
      token: process.env.LHCI_TOKEN,
    },
  },
};
