import React, { Component } from "react";
import {
    Button,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground,
} from "react-native";
import { sortArrayOfObjects, returnIndexFromFavStep } from '../utilities/common';
import { Game,findTheBestMove } from "../utilities/gamelogic";

var Sound = require("react-native-sound");
var whoosh = new Sound(
    "http://soundbible.com/mp3/Audience_Applause-Matthiew11-1206899159.mp3",
    Sound.MAIN_BUNDLE,
    (error) => {
        if (error) {
            // console.log("failed to load the sound", error);
            return;
        }
        // loaded successfully
        // console.log(
        //     "duration in seconds: " +
        //     whoosh.getDuration() +
        //     "number of channels: " +
        //     whoosh.getNumberOfChannels()
        // );

        // Play the sound with an onEnd callback
    }
);
function initialBoardState() {
    return ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
}
function getMachineBoardState() {
    return ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
}
class TicTacToeBoard extends Component {
    state = {
        winner: null,
        isWinnerDeclared: false,
        currentPlayer: "X",
        boardState: initialBoardState(),
        noticeMessage: "",
        gameEndedWithNoResult: false,
        machineBoardState: getMachineBoardState(),
        oneTimeHit: false
    };
    resetBoardState(index) {
        // console.log(initialBoardState());
        this.setState({
            winner: null,
            isWinnerDeclared: false,
            currentPlayer: "X",
            boardState: initialBoardState(),
            noticeMessage: "",
            gameEndedWithNoResult: false,
            machineBoardState: getMachineBoardState(),
            oneTimeHit: false
        });
    }
    renderSquare(index) {
        this[`Square${index}Ref`] = React.createRef();
        if (index != 8) {
            return (
                <Square
                    value={this.state.boardState[index]}
                    boardIndex={index}
                    updateState={() => {
                        this.updateState(index);
                    }}
                    ref={this[`Square${index}Ref`]}
                    style={boardStyles.square}
                    machineSignal={this.state.machineBoardState[index]}
                />
            );
        }
        else {
            return (
                <Square
                    value={this.state.boardState[index]}
                    boardIndex={index}
                    updateState={() => {
                        this.updateState(index);
                    }}
                    ref={component => this.test8 = component}
                    style={boardStyles.square}
                    machineSignal={this.state.machineBoardState[index]}
                />
            );
        }
    }
    gameEndedWithNoResultNotify() {
        const gameDrawn = "Game drawn !!";
        this.setState({ noticeMessage: gameDrawn });
    }
    clearNotifMessage() {
        this.setState({ noticeMessage: "" });
    }

    updateState(index) {
        if (this.state.gameEndedWithNoResult) {
            this.gameEndedWithNoResultNotify();
            return;
        }
        // console.log("INDEX " + index + " " + this.state.boardState);
        if (!this.state.isWinnerDeclared) {
            // stop revisting the mark 

            this.setState({ machineBoardState: getMachineBoardState() })


            let boardIndexValue = this.state.boardState[index];
            if (boardIndexValue == "-") {
                this.clearNotifMessage();
                // console.log("Clicked the index " + index + this.state.currentPlayer);
                let tempState = this.state.boardState;
                tempState[index] = this.state.currentPlayer;
                // console.log(tempState);
                this.setState({ boardState: tempState });
                // console.log(
                //     this.state.boardState[index] + " " + { boardState: tempState }
                // );
                this.checkWinner();
                if (this.state.currentPlayer == "X") { this.state.currentPlayer = "O"; }
                else { this.state.currentPlayer = "X"; }

                if (!this.state.isWinnerDeclared) {
                    let count = 0;
                    this.state.boardState.forEach((val) => {
                        if (val == "X" || val == "O") count += 1;
                    });
                    if (count == 9) {
                        // console.log(this.state.isWinnerDeclared);
                        this.state.gameEndedWithNoResult= true ;
                        this.gameEndedWithNoResultNotify();
                    }
                }
                //// console.log("Hiting manula onlvick "+JSON.stringify(this["Square0Ref"]))
                //// console.log(this["Square8Ref"].current);
                //// console.log(this.test8.props);
                if (!this.state.isWinnerDeclared && !this.state.gameEndedWithNoResult)
                    this.implementMachineStep();
            } else {
                const alreadyWinnerDeclared = `'${this.state.boardState[index]}' has already filled, kindly choose other square`;
                this.setState({ noticeMessage: alreadyWinnerDeclared });
            }
        } else {
            const alreadyWinnerDeclared = `${this.state.winner} has already won !!. Kindly restart the game`;
            this.setState({ noticeMessage: alreadyWinnerDeclared });
        }
    }
    
    implementMachineStep() {
        let player = this.state.currentPlayer;
        // console.log("HIT CAME1" + player)
        if (player == "O") {
            if (this.state.oneTimeHit == false) {
                let game = new Game("X","O");
                game.player="O";
                game.opponent="X";
                // console.log("^^^^^HITTING GAME LOGIC WITH BOARD ^^^^^^^" );
                let arr = this.state.boardState.slice();
        let newArr = [];
        while (arr.length) newArr.push(arr.splice(0, 3));
                // console.log("m"+newArr)
               let k= game.findTheBestMove(newArr);
               console.log("Before board state"+this.state.boardState+" Finished successfully "+k);
                let machineFavIndex = k;//this.getMachineFavourStep();
                // console.log("HIT CAMEllllllllllllllll"+k)
                let temp = this.state.machineBoardState;
                temp[machineFavIndex] = 'mark';
                // console.log("HIT CAME")
                this.setState({ machineBoardState: temp });
                // console.log("HIT CAME bd ste" + this.state.machineBoardState)
            }
            else {
                this.state.oneTimeHit = true;
            }
            //  React.createRef().current.click
        }
    }
    getMachineFavourStep() {
        let boardState = this.state.boardState;
        let xSpottingInfo = new Array();
        for (let index = 0; index < 9; index++) {

            let val = boardState[index];
            if (val == "X") {
                // total four directions
                if (index % 3 == 0) {
                    // only horizontal indexes
                    let hrztemp = { xCount: 1, index: index, pathType: "horizontal" }
                    if (boardState[index + 1] == "X")
                        hrztemp.xCount += 1;
                    if (boardState[index + 2] == "X")
                        hrztemp.xCount += 1;
                    xSpottingInfo.push(hrztemp);
                }
                if (index <= 2) {
                    // only vertical indexes
                    let vertemp = { xCount: 1, index: index, pathType: "vertical" }
                    if (boardState[index + 3] == "X")
                        vertemp.xCount += 1;
                    if (boardState[index + 6] == "X")
                        vertemp.xCount += 1;
                    xSpottingInfo.push(vertemp);
                }
                if (index == 0) {
                    // 0-8 diagonal
                    let firstDiag = { xCount: 1, index: index, pathType: "firstdg" }
                    if (boardState[index + 4] == "X")
                        firstDiag.xCount += 1;
                    if (boardState[index + 8] == "X")
                        firstDiag.xCount += 1;
                    xSpottingInfo.push(firstDiag);
                }
                if (index == 2) {
                    // 0-8 diagonal
                    let secDiag = { xCount: 1, index: index, pathType: "secdg" }
                    if (boardState[index + 4] == "X")
                        secDiag.xCount += 1;
                    if (boardState[index + 8] == "X")
                        secDiag.xCount += 1;
                    xSpottingInfo.push(secDiag);
                }
            }
            index++;
        }
        let sortedFavArr = sortArrayOfObjects(xSpottingInfo, "xCount");
        // console.log("SORTED ARRAY ", sortArrayOfObjects);
        let favStep = null;
        if (sortedFavArr.length > 0)
            favStep = sortedFavArr[0];
        // console.log("FAV STEP" + favStep);
        if (favStep) {
            let favIndex = this.returnIndexFromFavStep(favStep);
            if (favIndex != "NA")
                return favIndex;
        }
        for (let k = 0; k < 9; k++) {
            if (boardState[k] == "-") {
                // console.log("RETURN NA" + k);
                return k;
            }
        }
    }

    returnIndexFromFavStep(favStep) {
        // console.log(" CAME TO RETURNINDEXFROM FAVSTEP " + favStep);
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
            // console.log("IN DEX : " + pointer + "Near by left walkl" + nearByLeftWallDistance + "right " + nearByRightWallIndex)
            for (let movingPointer = nearByLeftWallDistance; movingPointer < pointer; movingPointer++) {
                if (this.state.boardState[movingPointer] == "-") {
                    // console.log(" FOUND THE INDEX IN HOR LEFT" + movingPointer);
                    return movingPointer;
                }
            }
            for (let movingPointer = pointer + 1; movingPointer <= nearByRightWallIndex; movingPointer++) {
                if (this.state.boardState[movingPointer] == "-") {
                    // console.log(" FOUND THE INDEX IN HOR right" + movingPointer);
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
                nearByTopWallDistance = this.getNearByTopIndex(pointer);
            }
            if (pointer >= 6) {
                nearByBottomWallIndex = pointer;
            }
            else {
                nearByBottomWallIndex = this.getNearByBottomIndex(pointer);

            }
            // console.log("IN DEX : " + pointer + "Near by top walkl" + nearByTopWallDistance + "bottom " + nearByBottomWallIndex)
            for (let movingPointer = nearByTopWallDistance; movingPointer < pointer; movingPointer += 3) {
                if (this.state.boardState[movingPointer] == "-") {
                    // console.log(" FOUND THE INDEX IN verf top" + movingPointer);
                    return movingPointer;
                }
            }
            for (let movingPointer = pointer + 1; movingPointer <= nearByBottomWallIndex; movingPointer++) {
                if (this.state.boardState[movingPointer] == "-") {
                    // console.log(" FOUND THE INDEX IN ver bottom" + movingPointer);
                    return movingPointer;
                }
            }

        }
        return "NA";
    }
    getNearByTopIndex(index) {
        if (index <= 2)
            return index;
        return this.getNearByTopIndex(index - 3);
    }
    getNearByBottomIndex(index) {
        if (index >= 6)
            return index;
        return this.getNearByBottomIndex(index + 3);
    }


    declareWinner(winnerVal) {
        // console.log("******** winner is ***" + winnerVal);
        this.state.isWinnerDeclared = true;
        this.state.winner = winnerVal;
        const alreadyWinnerDeclared = `${this.state.winner} has  won !!.`;
        this.setState({ noticeMessage: alreadyWinnerDeclared });
        // console.log(
        //     this.state.winner + " is the winner" + this.state.isWinnerDeclared
        // );
        this.playClapSound();
    }
    playClapSound() {
        // play the file tone.mp3
        try {
            // console.log("start");
            // Enable playback in silence mode
            //Sound.setCategory('Playback');

            // Load the sound file 'whoosh.mp3' from the app bundle
            // See notes below about preloading sounds within initialization code below.

            whoosh.play((success) => {
                if (success) {
                    // console.log("successfully finished playing");
                } else {
                    // console.log("playback failed due to audio decoding errors");
                }
            });
        } catch (e) {
            // console.log("errrofdt");
        }
    }
    checkWinner() {
        let index = 0;
        while (index <= 8) {
            let val = this.state.boardState[index];
            if (val == "X" || val == "O") {
                // total four directions
                if (index % 3 == 0) {
                    // only horizontal indexes
                    if (
                        val == this.state.boardState[index] &&
                        val == this.state.boardState[index + 1] &&
                        val == this.state.boardState[index + 2]
                    ) {
                        // console.log("declared!" + val);
                        this.declareWinner(val);
                        return;
                    }
                }
                if (index <= 2) {
                    // only vertical indexes
                    if (
                        val == this.state.boardState[index] &&
                        val == this.state.boardState[index + 3] &&
                        val == this.state.boardState[index + 6]
                    ) {
                        // console.log("declared!2");
                        this.declareWinner(val);
                        return;
                    }
                }
                if (index == 0) {
                    // 0-8 diagonal
                    // console.log(
                    //     this.state.boardState[index] +
                    //     this.state.boardState[index + 4] +
                    //     this.state.boardState[index + 8]
                    // );
                    if (
                        val == this.state.boardState[index] &&
                        val == this.state.boardState[index + 4] &&
                        val == this.state.boardState[index + 8]
                    ) {
                        // console.log("declared3");
                        this.declareWinner(val);
                        return;
                    }
                }
                if (index == 2) {
                    // 0-8 diagonal
                    if (
                        val == this.state.boardState[index] &&
                        val == this.state.boardState[index + 2] &&
                        val == this.state.boardState[index + 4]
                    ) {
                         console.log("declared!4");
                        this.declareWinner(val);
                        return;
                    }
                }
            }
            index++;
        }
    }
    prepareWinnerMessage(winnerCharacter) {
        const msg = `The winner is ${winnerCharacter} `;
        this.setState({ noticeMessage: msg });
        this.setState({ isWinnerDeclared: true });
    }

    render() {
        return (
            
         
            <View style={{ marginTop: 100, marginLeft: 100, width: 200 }}>
                <View>
                    <Text style={boardStyles.gameName}>TicTacToe</Text>
                </View>

                <View>
                    <Button
                        onPress={() => {
                            this.resetBoardState();
                        }}
                        title="Reset Game"
                    ></Button>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={boardStyles.row}>
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </View>
                    <View style={boardStyles.row}>
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </View>
                    <View style={boardStyles.row}>
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </View>
                </View>

                <View>
                    {this.state.noticeMessage.trim().length > 0 &&
                        Alert.alert(
                            "",
                            this.state.noticeMessage,
                            [{ text: "OK", onPress: () =>  console.log("OK Pressed") }],
                            { cancelable: false }
                        )}
                </View>
            </View>

             );
    }
}

class Square extends Component {
    state = {
        machineHitDone: false
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // If we have a snapshot value, we've just added new items.
        // Adjust scroll so these new items don't push the old ones out of view.
        // (snapshot here is the value returned from getSnapshotBeforeUpdate)
        if (this.props !== null) {
            //   // console.log(this.props)
            if (this.props.machineSignal == "mark") {
                // console.log("came for hti")
                this.props.updateState();
            }
        }
    }
    render() {
        return (
            <View style={squareStyles.main}>
                <Text
                    style={squareStyles.block}
                    onPress={() => this.props.updateState()}
                >
                    {this.props.value}
                </Text>

            </View>
        );
    }
}

const squareStyles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "center",
    },
    block: {
        fontWeight: "bold",
        fontSize: 20,
        borderWidth: 0.4,
        height: 60,
        textAlignVertical: "center",
        textAlign: "center",
    },
});
const boardStyles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
      },
    main: {
        borderColor: "black",
        flex: 1,
    },
    row: {
        flexDirection: "row",
        borderColor: "black",
    },
    square: {
        flex: 1,
    },
    headline: {
        textAlign: "center", // <-- the magic
        fontWeight: "bold",
        fontSize: 10,
        marginTop: 10,
        fontFamily: "arial",
    },
    gameName: {
        textAlign: "center", // <-- the magic
        fontSize: 20,
        marginBottom: 30,
        color: "black",
    },
});

export { TicTacToeBoard };
