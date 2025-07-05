// Generic fallback type declarations for external modules lacking bundled types.

// React is already typed via @types/react, but in case module resolution fails in certain tooling environments,
// this fallback prevents "Cannot find module 'react'" errors during isolated type checks.
declare module 'react' {
  import * as React from 'react';
  export = React;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
}

// Google Generative AI packages currently ship without TypeScript typings.
// These ambient declarations provide an "any" fallback so compilation succeeds.
declare module '@google/genai' {
  const GenAI: any;
  export = GenAI;
}

declare module '@google/generative-ai' {
  const GenerativeAI: any;
  export = GenerativeAI;
}

// react-markdown ships its own types, but some setups still complain—fallback to any.
declare module 'react-markdown' {
  const ReactMarkdown: any;
  export default ReactMarkdown;
}