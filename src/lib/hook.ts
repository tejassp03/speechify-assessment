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

  const bounds = getElementBounds(element);
      /*Checking if the x coordinate is greater than the left most bound,
    Checking if the x coordinate is lesser than the left most bound plus the width of the bound
    same for the y coordinate as well.
    */
  return(
    coordinate.x >= bounds.left  &&
    coordinate.x <= bounds.left + bounds.width &&
    coordinate.y >= bounds.top &&
    coordinate.y <= bounds.top  + bounds.height
  );



}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
const elemStyle = window.getComputedStyle(element);
const lineHeight = parseFloat(elemStyle.lineHeight);

return lineHeight;
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

      const coordinate = {x: e.pageX,y: e.pageY};

      //parsing and checking if each element is inside the point or not

      for(const element of parsedElements){

        if(isPointInsideElement(coordinate,element))
        {
          const bounds = getElementBounds(element);
          setHoverInfo({
              element,
              top: bounds.top,
              left: bounds.left + bounds.width,
              heightOfFirstLine: getLineHeightOfFirstLine(element)
          });
          return;
        }
      }
      setHoverInfo(null);
    }

    // Adding a mousemove event listener to attach it to handleMouseAction

    window.addEventListener('mousemove', handleMouseAction);
    
  }, [parsedElements]);

  return hoverInfo;
}
