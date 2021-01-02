function sortArrayOfObjects(arr, key) {
    // o(n^2)
    return arr.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
}
function returnIndexFromFavStep(favStep) {
    console.log(" CAME TO RETURNINDEXFROM FAVSTEP " + favStep);
    let favIndex = 0, pointer = 0;
    if (favStep["pathType"] == "horizontal") {
        // choose where to insert 
        pointer = favStep["index"];
        let nearByLeftWallDistance = 0;
        let nearByRightWallIndex = 2;
        if (pointer > 2) {
            nearByLeftWallDistance = pointer % 3;
            nearByRightWallIndex = pointer - nearByLeftWallDistance + 2;

        }
        console.log("IN DEX : "+pointer + "Near by left walkl" + nearByLeftWallDistance + "right " + nearByRightWallIndex)
        for (let movingPointer = nearByLeftWallDistance; movingPointer < pointer; movingPointer++) {
            if (this.state.boardState[movingPointer] == "-") {
                console.log(" FOUND THE INDEX IN HOR LEFT" + movingPointer);
                return movingPointer;
            }
        }
        for (let movingPointer = pointer + 1; movingPointer <= nearByRightWallIndex; movingPointer++) {
            if (this.state.boardState[movingPointer] == "-") {
                console.log(" FOUND THE INDEX IN HOR right" + movingPointer);
                return movingPointer;
            }
        }
    }

    if (favStep["pathType"] == "vertical") {
        // choose where to insert 
        pointer = favStep["index"];
        let nearByTopWallDistance = 0;
        let nearByBottomWallIndex = 2;
        if (pointer < 2) {
            nearByTopWallDistance = pointer;
        }
        else {
            nearByTopWallDistance = getNearByTopIndex(pointer);
        }
        if (pointer >= 6) {
            nearByBottomWallIndex = pointer;
        }
        else {
            nearByBottomWallIndex = getNearByBottomIndex(pointer);

        }
        console.log("IN DEX : "+pointer + "Near by top walkl" + nearByTopWallDistance + "bottom " + nearByBottomWallIndex)
        for (let movingPointer = nearByTopWallDistance; movingPointer < pointer; movingPointer+=3) {
            if (this.state.boardState[movingPointer] == "-") {
                console.log(" FOUND THE INDEX IN verf top" + movingPointer);
                return movingPointer;
            }
        }
        for (let movingPointer = pointer + 1; movingPointer <= nearByBottomWallIndex; movingPointer++) {
            if (this.state.boardState[movingPointer] == "-") {
                console.log(" FOUND THE INDEX IN ver bottom" + movingPointer);
                return movingPointer;
            }
        }

    }
    return "NA";
}
function getNearByTopIndex(index) {
    if (index <= 2)
        return index;
    return getNearByTopIndex(index - 3);
}
function getNearByBottomIndex(index) {
    if (index >= 6)
        return index;
    return getNearByBottomIndex(index + 3);
}
export { sortArrayOfObjects,returnIndexFromFavStep };



