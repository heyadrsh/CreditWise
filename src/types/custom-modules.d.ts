// Generic fallback type declarations for external modules lacking bundled types.

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

// Missing typings for remark-gfm

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
}