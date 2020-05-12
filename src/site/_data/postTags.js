const tags = {
  '3d': {
    title: '3D',
  },
  accessibility: {
    title: 'Accessibility',
  },
  amp: {
    title: 'AMP',
  },
  analytics: {
    title: 'Analytics',
  },
  audio: {
    title: 'Audio',
  },
  'augmented-reality': {
    title: 'Augmented Reality',
  },
  canvas: {
    title: 'Canvas',
  },
  capabilities: {
    title: 'Capabilities',
  },
  'case-study': {
    title: 'Case Study',
  },
  cast: {
    title: 'Cast',
  },
  'chrome-ux-report': {
    title: 'Chrome UX Report',
  },
  'chrome-dev-summit': {
    title: 'Chrome Dev Summit',
  },
  'content-security-policy': {
    title: 'Content Security Policy',
  },
  cookies: {
    title: 'Cookies',
  },
  cors: {
    title: 'CORS',
  },
  css: {
    title: 'CSS',
  },
  devtools: {
    title: 'DevTools',
  },
  dom: {
    title: 'DOM',
  },
  encryption: {
    title: 'Encryption',
  },
  'engineering-blog': {
    title: 'Engineering Blog',
  },
  'feature-policy': {
    title: 'Feature Policy',
  },
  'file-system': {
    title: 'File System',
  },
  fonts: {
    title: 'Fonts',
  },
  forms: {
    title: 'Forms',
  },
  fugu: {
    title: 'Fugu',
  },
  games: {
    title: 'Games',
  },
  graphics: {
    title: 'Graphics',
  },
  houdini: {
    title: 'Houdini',
  },
  identity: {
    title: 'Identity',
  },
  images: {
    title: 'Images',
  },
  install: {
    title: 'Install',
  },
  intl: {
    title: 'Intl',
  },
  iot: {
    title: 'IoT',
  },
  javascript: {
    title: 'JavaScript',
  },
  layout: {
    title: 'Layout',
  },
  lighthouse: {
    title: 'Lighthouse',
  },
  media: {
    title: 'Media',
  },
  'media-queries': {
    title: 'Media Queries',
  },
  metrics: {
    title: 'Metrics',
  },
  mobile: {
    title: 'Mobile',
  },
  modules: {
    title: 'Modules',
  },
  monetization: {
    title: 'Monetization',
  },
  network: {
    title: 'Network',
  },
  node: {
    title: 'Node',
  },
  notifications: {
    title: 'Notifications',
  },
  offline: {
    title: 'Offline',
  },
  'origin-trials': {
    title: 'Origin Trials',
  },
  payments: {
    title: 'Payments',
  },
  performance: {
    title: 'Performance',
  },
  permissions: {
    title: 'Permissions',
  },
  'progressive-web-apps': {
    title: 'Progressive Web Apps',
  },
  puppeteer: {
    title: 'Puppeteer',
  },
  rendering: {
    title: 'Rendering',
  },
  security: {
    title: 'Security',
  },
  seo: {
    title: 'SEO',
  },
  'service-worker': {
    title: 'Service Worker',
  },
  storage: {
    title: 'Storage',
  },
  svg: {
    title: 'SVG',
  },
  testing: {
    title: 'Testing',
  },
  ux: {
    title: 'UX',
  },
  'virtual-reality': {
    title: 'Virtual Reality',
  },
  'web-assembly': {
    title: 'Web Assembly',
  },
  'web-bundles': {
    title: 'Web Bundles',
  },
  'web-vitals': {
    title: 'Web Vitals',
  },
  webxr: {
    title: 'WebXR',
  },
};

const postTags = {};

Object.keys(tags).forEach((key) => {
  const tag = tags[key];
  const description = tag.description
    ? tag.description
    : `Our latest news, updates, and stories about ${tag.title}.`;

  postTags[key] = {
    ...tag,
    description,
    href: `/tags/${key}/`,
    key,
  };
});

module.exports = postTags;
