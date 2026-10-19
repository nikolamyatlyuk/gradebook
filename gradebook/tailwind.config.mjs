const n=(v)=>`rgb(var(--${v}) / <alpha-value>)`;
/** @type {import("tailwindcss").Config} */
export default {content:["./app/**/*.tsx","./components/**/*.tsx"],theme:{extend:{colors:{neutral:{300:n('n300'),400:n('n400'),500:n('n500'),800:n('n800'),900:n('n900')}}}},plugins:[]};
