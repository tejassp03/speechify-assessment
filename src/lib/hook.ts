import { useEffect, useState } from "react";


/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  const rect = element.getBoundingClientRect();
  return (
    coordinate.x >= rect.left &&
    coordinate.x <= rect.right &&
    coordinate.y >= rect.top &&
    coordinate.y <= rect.bottom
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  if (!element.textContent?.trim()) return 0;
  
  // First try the element's own computed style
  const elementStyle = window.getComputedStyle(element);
  const elementFontSize = parseFloat(elementStyle.fontSize);
  
  // If element has explicit font-size (not 16px default), use it
  if (elementFontSize !== 16) {
    return elementFontSize;
  }
  
  // Otherwise check first child with text content
  for (const child of Array.from(element.children)) {
    if (child.textContent?.trim()) {
      const childStyle = window.getComputedStyle(child as HTMLElement);
      return parseFloat(childStyle.fontSize);
    }
  }
  
  // Fallback to element's font size
  return elementFontSize;
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {

  const [hoverInfo, setHoverInfo] = useState<HoveredElementInfo | null>(null);

  //An use effect to catch the hover of the element and pass the info onto the hoverInfo state variable.
  useEffect(()=> {

    const handleMouseAction = (e: MouseEvent) => {
      const coordinate = {
        x: e.clientX - window.scrollX,
        y: e.clientY - window.scrollY,
      };

      //parsing and checking if each element is inside the point or not

      for(const element of parsedElements){

        if(isPointInsideElement(coordinate,element))
        {
          const bounds = getElementBounds(element);
          setHoverInfo({
              element,
              top: bounds.top,
              left: bounds.left,
              heightOfFirstLine: getLineHeightOfFirstLine(element)
          });
          return;
        }
      }
        setHoverInfo(null);
    }

    // Adding a mousemove event listener to attach it to handleMouseAction

    window.addEventListener('mousemove', handleMouseAction);
    return ()=> window.removeEventListener('mousemove', handleMouseAction);
  }, [parsedElements]);
  
  return hoverInfo;
}
