export function drawElement(coords: [number, number], element: number): void {
    const [x, y] = coords;
    const mapElement = document.getElementById("map");
    if(mapElement) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add("map-element");
        pieceElement.style.gridColumnStart = (y+1).toString();
        pieceElement.style.gridRowStart = (x+1).toString();

        // create internal elements
        const elementDivMiddle = document.createElement("div");
        elementDivMiddle.classList.add("line");
        elementDivMiddle.style.gridColumnStart = (2).toString();
        elementDivMiddle.style.gridRowStart = (2).toString();

        const elementDivTop = document.createElement("div");
        elementDivTop.classList.add("line");
        elementDivTop.style.gridColumnStart = (2).toString();
        elementDivTop.style.gridRowStart = (1).toString();

        const elementDivRight = document.createElement("div");
        elementDivRight.classList.add("line");
        elementDivRight.style.gridColumnStart = (3).toString();
        elementDivRight.style.gridRowStart = (2).toString();

        const elementDivBottom = document.createElement("div");
        elementDivBottom.classList.add("line");
        elementDivBottom.style.gridColumnStart = (2).toString();
        elementDivBottom.style.gridRowStart = (3).toString();

        const elementDivLeft = document.createElement("div");
        elementDivLeft.classList.add("line");
        elementDivLeft.style.gridColumnStart = (1).toString();
        elementDivLeft.style.gridRowStart = (2).toString();

        // add corresponding elements
        switch(element) {
            case 0: // vertical line
                pieceElement.appendChild(elementDivLeft);                
                pieceElement.appendChild(elementDivMiddle);
                pieceElement.appendChild(elementDivRight);
                break;

            case 1: // horizontal line
                pieceElement.appendChild(elementDivTop);
                pieceElement.appendChild(elementDivMiddle);
                pieceElement.appendChild(elementDivBottom);
                break;

            case 2: // top right twist
                pieceElement.appendChild(elementDivTop);
                pieceElement.appendChild(elementDivRight);
                elementDivMiddle.classList.add("top-right-twist");
                pieceElement.appendChild(elementDivMiddle);
                break;

            case 3: // top left twist
                pieceElement.appendChild(elementDivTop);
                pieceElement.appendChild(elementDivLeft);
                elementDivMiddle.classList.add("top-left-twist");
                pieceElement.appendChild(elementDivMiddle);
                break;

            case 4: // bottom right twist
                pieceElement.appendChild(elementDivBottom);
                pieceElement.appendChild(elementDivRight);
                elementDivMiddle.classList.add("bottom-right-twist");
                pieceElement.appendChild(elementDivMiddle);
                break;

            case 5: // bottom left twist
                pieceElement.appendChild(elementDivBottom);
                pieceElement.appendChild(elementDivLeft);
                elementDivMiddle.classList.add("bottom-left-twist");
                pieceElement.appendChild(elementDivMiddle);
                break;

            case 6: // top fork
                pieceElement.appendChild(elementDivTop);
                pieceElement.appendChild(elementDivMiddle);
                pieceElement.appendChild(elementDivRight);
                pieceElement.appendChild(elementDivLeft);
                break;

            case 7: // bottom fork  
                pieceElement.appendChild(elementDivRight);
                pieceElement.appendChild(elementDivBottom);
                pieceElement.appendChild(elementDivMiddle);
                pieceElement.appendChild(elementDivLeft);
                break;

            case 8: // right fork   
                pieceElement.appendChild(elementDivTop);
                pieceElement.appendChild(elementDivRight);
                pieceElement.appendChild(elementDivBottom);
                pieceElement.appendChild(elementDivMiddle);
                break;

            case 9: // left fork
                pieceElement.appendChild(elementDivTop);
                pieceElement.appendChild(elementDivBottom);
                pieceElement.appendChild(elementDivMiddle);
                pieceElement.appendChild(elementDivLeft);
                break;
        }
        mapElement.appendChild(pieceElement);
    }
}