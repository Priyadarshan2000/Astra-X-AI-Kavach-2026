import { Highlight, themes } from 'prism-react-renderer'

const LANG = { c: 'c', cpp: 'cpp', python: 'python', java: 'java' }

export default function CodePane({ code = '', language = 'c', highlightLines = [], label }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border-[2.5px] border-cyan bg-void shadow-[6px_6px_0_#8b5cff]">
      {label && (
        <div className="flex items-center justify-between border-b-[2.5px] border-cyan bg-panel px-4 py-2">
          <span className="hud-label">{label}</span>
          <span className="font-ui text-[10px] uppercase tracking-widest text-fog">{language}</span>
        </div>
      )}
      <div className="flex-1 overflow-auto p-3">
        <Highlight theme={themes.nightOwl} code={code.trimEnd()} language={LANG[language] || 'clike'}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} m-0 text-[12px] leading-6`} style={{ ...style, background: 'transparent' }}>
              {tokens.map((line, i) => {
                const hot = highlightLines.includes(i + 1)
                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className={hot ? 'bg-amber/20 shadow-[inset_4px_0_0_#ffe44d]' : undefined}
                  >
                    <span className="mr-4 inline-block w-6 text-right text-fog/40">{i + 1}</span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                )
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}
