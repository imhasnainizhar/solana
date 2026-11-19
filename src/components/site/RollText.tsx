/** Letter-by-letter "roll" on hover/focus of the parent link or button (.sol-roll in motion.css). */
export function RollText({ children }: { children: string }) {
  const chars = [...children]
  const line = () => (
    <span>
      {chars.map((c, i) => (
        <span className="sol-roll-char" key={i} style={{ ['--ci' as string]: i }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="sol-roll">
        {line()}
        {line()}
      </span>
    </>
  )
}
