import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint not-found-page">
      <div class="not-found-content">
        <div class="not-found-code">404</div>
        <h1>Signal Lost</h1>
        <p>This page doesn't exist in the Codex — yet.</p>
        <div class="not-found-actions">
          <a href={baseDir} class="not-found-home">Return to Base</a>
        </div>
      </div>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
