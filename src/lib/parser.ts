/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:**
 *  Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  Start Parsing inside the body element of the HTMLPage.
 *  A top level readable element is defined as follows:
 *      1. The text node contained in the element should not be empty
 *      2. The element should not be in the ignore list (also referred as the block list)
 *      3. The element should not be a child of another element that has only one child.
 *            For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 *      4. A top level readable element should not contain another top level readable element.
 *            For example: Consider the following HTML document:
 *            <body>
 *              <div id="root"></div>
 *              <div id="content-1">
 *                <article>
 *                  <header>
 *                    <h1 id="title">An Interesting HTML Document</h1>
 *                    <span>
 *                      <address id="test">John Doe</address>
 *                    </span>
 *                  </header>
 *                  <section></section>
 *                </article>
 *              </div>
 *            </body>;
 *            In this case, #content-1 should not be considered as a top level readable element.
 */
export function getTopLevelReadableElementsOnPage(): HTMLElement[] {

  const body =  document.body;
  const result: HTMLElement[] = [];

  function isReadable(element: HTMLElement) : boolean {

    // Check if element has text content
    const text = element.textContent?.trim() || '';
    if(text === '') {
      return false;
    }

    // If element has exactly one child, consider the parent as readable instead
    if(element.children.length === 1) {
      return false;
    }

    return true;
  }

  function hasNestedReadableElem(element: HTMLElement)
  {
    //Looping through all the children from the element to check if it has nested elements
    for(const child of Array.from(element.children))
    {
      //checking if the child is also an HTML Element
      if(child instanceof HTMLElement)
      {
          //Check if its also readable
          if(isReadable(child))
          {
            return true;
          }

          if(hasNestedReadableElem(child))
          {
            return true;
          }
      }
    }

    return false;

  }

  //writing a function to now traverse the elements and push it to an array of Html Elements

  function traverse(element: HTMLElement){
    // first check if element is in ignore list
    if(IGNORE_LIST.includes(element.tagName)) {
      return;
    }

    // Handle single child case - consider parent as readable
    if(element.children.length === 1 && element.textContent?.trim()) {
      result.push(element);
      return;
    }
    
    // or check if element is readable and doesn't have nested readable elements
    if(isReadable(element) && !hasNestedReadableElem(element)) {
      result.push(element);
      return;
    }

    //create an array from the element and traversing the children elements through the loop
    Array.from(element.children).forEach(child =>{

    if(child instanceof HTMLElement)
    {
      traverse(child);
    }
    });

  }
  
  //Now traversing the entire body element
  traverse(body);
  return result;

}
