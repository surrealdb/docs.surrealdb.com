import siteConfig from '@generated/docusaurus.config';
export default function prismIncludeLanguages(PrismObject) {
  const {
    themeConfig: {prism},
  } = siteConfig;
  const {additionalLanguages} = prism;
  // Prism components work on the Prism instance on the window, while prism-
  // react-renderer uses its own Prism instance. We temporarily mount the
  // instance onto window, import components to enhance it, then remove it to
  // avoid polluting global namespace.
  // You can mutate PrismObject: registering plugins, deleting languages... As
  // long as you don't re-assign it
  globalThis.Prism = PrismObject;
  Prism.languages.surql = {
    comment: {
      pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
      lookbehind: true,
    },
    string: {
      pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
      greedy: true,
      lookbehind: true,
    },
    variable: /[$][\w.]+/,
    function: /\b(?:fn|function|count|sleep|rand|(?:(array|crypto|duration|fn|geo|http|is|math|meta|ml|object|parse|rand|search|session|sleep|string|time|type|vector)::[\w-]+)(::[\w-]+)*)(?=\s*(<[^>]+>)?\s*\()/i,
    range: /\b[\w\d]+[:]([\w\d]+\b|⟨[^⟩]+⟩|`[^`]+`)\.\.([\w\d]+\b|⟨[^⟩]+⟩|`[^`]+`)/i,
    record: /\b[\w\d]+[:](([\w\d]+\b|⟨[^⟩]+⟩|`[^`]+`)|(?=\{|\[))?/i,
    cast: /[<](bool|int|float|string|number|decimal|datetime|duration|future)[>]/,
    constant: /\b(?:math|time)::[\w]+/i,
    keyword: /\b(?:AFTER|ANALYZER|ASC|AS|ASSERT|BEFORE|BEGIN( TRANSACTION)?|BM25|BREAK|CANCEL( TRANSACTION)?|COLUMNS|COMMENT|COMMIT( TRANSACTION)?|CONTENT|CREATE|CONTINUE|DATABASE|DB|DEFAULT|DEFINE|DELETE|DESC|DESCRIBE|DIFF|DIMENSION|DIST|DROP|ELSE|END|ES256|ES384|ES512|EUCLIDEAN|EVENT|EXISTS|EXPLAIN|FETCH|FIELD|FIELDS|FILTERS|FOR|FROM|FULL|FUNCTION|GROUP( BY)?|HIGHLIGHTS|HS256|HS384|HS512|HSNW|IF|INDEX|INFO|INSERT(( IGNORE)? INTO)?|INTO|IN|KILL|LET|LIMIT( BY)?|LIVE|LOGIN|MERGE|MTREE|NAMESPACE|NOINDEX|NOT|NS|ON DUPLICATE KEY UPDATE|ON|ONLY|ORDER( BY)?|OUT|PASSHASH|PASSWORD|PERMISSIONS|PS256|PS384|PS512|RELATE|REMOVE|REPLACE|RETURN|RS256|RS384|RS512|SCHEMAFULL|SCHEMALESS|SCOPE|SEARCH|SELECT|SESSION|SET|SIGNIN|SIGNUP|SPLIT( ON)?|START( AT)?|TABLE|THEN|THROW|TIMEOUT|TO|TOKEN|TOKENIZERS|TYPE|UNIQUE|UPDATE|USE|USER|VALUE|VALUES|VERSION|WITH|WHEN|WHERE)\b/,
    operator: /==|!=|\*=|\?=|=|!~|\*~|\?~|~|<=|<|>=|>|\+|-|@[0-9]*@|\*|×|∙|\/|÷|∋|∌|∈|∉|⊇|⊃|⊅|⊆|⊂|⊄|&&|\|\||\b(?:AND|OR|IS NOT|IS|CONTAINSALL|CONTAINSANY|CONTAINSNONE|CONTAINSSOME|CONTAINSNOT|CONTAINS|ALLINSIDE|ANYINSIDE|NONEINSIDE|SOMEINSIDE|NOTINSIDE|INSIDE|OUTSIDE|INTERSECTS)\b/i,
    connector: /[.]|<->|<-|->/,
    nothing: /\b(?:EMPTY|NONE|NULL)\b/i,
    boolean: /\b(?:TRUE|FALSE)\b/i,
    duration: /[1234567890]+(ns|µs|ms|s|m|h|d|w|y)/i,
    number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
    punctuation: /[;[\](){}`,]/,
  };
  additionalLanguages.forEach((lang) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`prismjs/components/prism-${lang}`);
  });
  delete globalThis.Prism;
}
