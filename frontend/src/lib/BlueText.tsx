// export default function renderLinkText(text: string): React.ReactNode[] {
//   const linkRegex = /{{(.*?)}}/g;
//   const parts: React.ReactNode[] = [];
//   let lastIndex = 0;
//   let match;

//   // while ((match = linkRegex.exec(text))) {
//   //   const linkText = match[1];
//   //   const url = match[2];

//   //   parts.push(text?.slice(lastIndex, match.index));

//   //   const Popup = () => {
//   //     alert("Hello World");
//   //   };

//   //   parts.push(
//   //     <span className="cursor-pointer" key={parts.length} onClick={Popup}>
//   //       <span
//   //         style={{
//   //           color: "blue",
//   //         }}
//   //       >
//   //         {`{{` + linkText + `}}`}
//   //       </span>
//   //     </span>
//   //   );

//   //   lastIndex = match.index + match[0].length;
//   // }

//   while ((match = linkRegex.exec(text))) {
//     const doubleBracesContent = match[0];

//     const index = text.indexOf(doubleBracesContent, lastIndex);

//     parts.push(text.slice(lastIndex, index));
//     parts.push(doubleBracesContent);
//     console.log("Double Curly Braces Found:", doubleBracesContent);

//     lastIndex = index + doubleBracesContent.length;
//   }

//   parts.push(text?.slice(lastIndex));
//   console.log("Parts Array:", parts);

//   return parts;
// }

export default function renderLinkText(text: string): string[] {
  const linkRegex = /{{(.*?)}}/g;
  const extractedStrings: string[] = [];
  let match;

  while ((match = linkRegex.exec(text))) {
    const linkText = match[1];
    extractedStrings.push(linkText);
  }

  return extractedStrings;
}

export function containsDoubleCurlyBrackets(inputString: any) {
  // Define a regular expression pattern to match double curly brackets
  const regexPattern = /\{\{.*\}\}/;

  // Test the input string against the pattern
  const containsDoubleBrackets = regexPattern.test(inputString);

  // Convert the boolean to a string
  const resultString = containsDoubleBrackets.toString();

  // Store the result in local storage
  localStorage.setItem("containsDoubleBrackets", resultString);

  // Return the result
  return containsDoubleBrackets;
}
