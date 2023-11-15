// Based on https://github.com/facebook/docusaurus/blob/ed9d2a26f5a7b8096804ae1b3a4fffc504f8f90d/packages/docusaurus-theme-classic/src/theme/CodeBlock/index.tsx
// which is under MIT License as per the banner

import "./styles.css"

import copy from "copy-text-to-clipboard"
import React, { useRef, useState } from "react"
import Translate, { translate } from "@docusaurus/Translate"

const CodeBlock = ({ children, ...props }) => {
  const pre = useRef(null)
  const [showCopied, setShowCopied] = useState(false)

  function grabText(el, root = true) {
    if (el.tagName == 'BUTTON') return '';
    if (el.children.length) {
        let t = [...el.children]
            .map(el => grabText(el, false))
            .filter(a => a)
            .join(root ? '\n' : '');
        return t;
    } else {
        return el.textContent;
    }
}

  const handleCopyCode = () => {
    if (pre.current) {
      copy(grabText(pre.current.querySelector(".code-container > *")))
    }
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <pre {...props} ref={pre}>
      {children}
      <button
        type="button"
        aria-label={translate({
          id: "theme.CodeBlock.copyButtonAriaLabel",
          message: "Copy code to clipboard",
          description: "The ARIA label for copy code blocks button",
        })}
        className="copy-button"
        onClick={handleCopyCode}
      >
        {showCopied ? (
          <Translate id="theme.CodeBlock.copied" description="The copied button label on code blocks">
            Copied
          </Translate>
        ) : (
          <Translate id="theme.CodeBlock.copy" description="The copy button label on code blocks">
            Copy
          </Translate>
        )}
      </button>
    </pre>
  )
}

export default CodeBlock