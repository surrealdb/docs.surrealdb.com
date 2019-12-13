Prism.languages.sql = {
	"comment": {
		pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
		lookbehind: !0
	},
	"string": {
		pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\])*\2/,
		greedy: !0,
		lookbehind: !0
	},
	"model": /\|[^\s]+\|/i,
	"regular": /\/[^\/]+\//i,
	"variable": /[$]([\w.])+/,
	"function": /\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/i,
	"keyword": /\b(?:AFTER|AND|AS|ASC|ASSERT|AT|BEFORE|BEGIN|BOTH|BY|CANCEL|COLLATE|COLUMNS|COMMIT|CONNECT|CONTENT|CREATE|DATABASE|DB|DEFINE|DELETE|DESC|DIFF|DROP|ELSE|EMPTY|END|EVENT|EXPUNGE|FIELD|FOR|FROM|FULL|GROUP|IF|INDEX|INFO|INSERT|INTO|KILL|LET|LIMIT|LIVE|LOGIN|MERGE|MISSING|NAMESPACE|NONE|NS|NUMERIC|ON|OR|ORDER|PASSWORD|PERMISSIONS|RAND|RELATE|REMOVE|RETURN|SCHEMAFULL|SCHEMALESS|SCOPE|SELECT|SESSION|SET|SIGNIN|SIGNUP|START|TABLE|THEN|TIMEOUT|TO|TOKEN|TRANSACTION|TYPE|UNIQUE|UPDATE|UPSERT|USE|VALUE|VERSION|WHEN|WHERE|WITH?)\b/i,
	"direction": /(?:<->|<-|->)/i,
	"boolean": /\b(?:TRUE|FALSE)\b/i,
	"null": /\b(?:NULL)\b/i,
	"void": /\b(?:VOID)\b/i,
	"number": /\b-?(?:0x)?\d*\.?[\da-f]+\b/,
	"operator": /[-+=~><!?≤≥∋∌⊇⊃⊅∈∉⊆⊂⊄×∙÷/*]|\b(?:ALLCONTAINEDIN|CONTAINS|CONTAINSALL|CONTAINSNONE|CONTAINSSOME|IN|IS|NOT|NONECONTAINEDIN|SOMECONTAINEDIN?)\b/i,
	"punctuation": /[;[\]()`,.]/
};
