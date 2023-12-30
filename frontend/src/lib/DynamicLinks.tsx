import Link from "next/link";

export default function renderDynamicLinks(
  text: string,
  openWindow: boolean
): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text))) {
    const linkText = match[1];
    const url = match[2];

    parts.push(text?.slice(lastIndex, match.index));

    if (openWindow == true) {
      const Popup = () => {
        window.open(url, "_blank ", "width=800,height=1200");
      };

      parts.push(
        <span
          className="cursor-pointer main-error"
          key={parts.length}
          onClick={Popup}
          rel="noopener noreferrer"
        >
          <span
            style={{
              color: "#0044e2",
            }}
          >
            {linkText}
          </span>
        </span>
      );
    }

    if (openWindow == false) {
      parts.push(
        <a href={url} target="_blank" className="main-error">
          <span
            style={{
              color: "#0044e2",
            }}
          >
            {linkText}
          </span>
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  parts.push(text?.slice(lastIndex));

  return parts;
}
