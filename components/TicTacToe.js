import React, { Component } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

var Sound = require('react-native-sound');
var whoosh = new Sound("http://soundbible.com/mp3/Audience_Applause-Matthiew11-1206899159.mp3", Sound.MAIN_BUNDLE, (error) => {

    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
    // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

    // Play the sound with an onEnd callback

});

class TicTacToeBoard extends Component {
    state = {
        winner: null,
        isWinnerDeclared: false,
        currentPlayer: "X",
        boardState: [
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
        ],
        noticeMessage: "",
        gameEndedWithNoResult: false,
    };
    resetBoardState(index) {
        this.setState({
            winner: null,
            isWinnerDeclared: false,
            gameEndedWithNoResult: false,
            currentPlayer: "X",
            boardState: [
                "-",
                "-",
                "-",
                "-",
                "-",
                "-",
                "-",
                "-",
                "-",
            ],
            noticeMessage: "",
        });
    }
    renderSquare(index) {
        this[`Square${index}Ref`]= React.createRef();
        return (
            <Square
                value={this.state.boardState[index]}
                boardIndex={index}
                updateState={() => {
                    this.updateState(index);
                }}
                ref={this[`Square${index}Ref`]}
                style={boardStyles.square}
            />
        );
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
        console.log("INDEX " + index + " " + this.state.boardState);
        if (!this.state.isWinnerDeclared) {
            let boardIndexValue = this.state.boardState[index];
            if (boardIndexValue == "-") {
                this.clearNotifMessage();
                console.log("Clicked the index " + index);
                let tempState = this.state.boardState;
                tempState[index] = this.state.currentPlayer;
                console.log(tempState);
                this.setState({ boardState: tempState });
                console.log(
                    this.state.boardState[index] + " " + { boardState: tempState }
                );
                this.checkWinner();
                if (this.state.currentPlayer == "X")
                    this.setState({ currentPlayer: "O" });
                else this.setState({ currentPlayer: "X" });
                if (!this.state.isWinnerDeclared) {
                    let count = 0;
                    this.state.boardState.forEach((val) => {
                        if (val == "X" || val == "O") count += 1;
                    });
                    if (count == 9) {
                        this.setState({ gameEndedWithNoResult: true });
                        this.gameEndedWithNoResultNotify();
                    }
                }
                //console.log("Hiting manula onlvick "+JSON.stringify(this["Square0Ref"]))
                //console.log(this["Square8Ref"].current);
                
                this.implementMachineStep()

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
        if (player == "O") {
            let machineFavIndex = this.getMachineFavourStep();

        }
    }
    getMachineFavourStep() {
        return 0;
    }
    declareWinner(winnerVal) {
        console.log("******** winner is ***" + winnerVal);
        this.setState({ isWinnerDeclared: true });
        this.setState({ winner: winnerVal });
        const alreadyWinnerDeclared = `${winnerVal} has  won !!.`;

        this.setState({ noticeMessage: alreadyWinnerDeclared });
        console.log(
            this.state.winner + " is the winner" + this.state.isWinnerDeclared
        );
        this.playClapSound();
    }
    playClapSound() {
        // play the file tone.mp3
        try {
            console.log("start")
            // Enable playback in silence mode
            //Sound.setCategory('Playback');

            // Load the sound file 'whoosh.mp3' from the app bundle
            // See notes below about preloading sounds within initialization code below.

            whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        catch (e) {
            console.log("errrofdt");
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
                        console.log("declared!" + val);
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
                        console.log("declared!2");
                        this.declareWinner(val);
                        return;
                    }
                }
                if (index == 0) {
                    // 0-8 diagonal 
                    console.log(
                        this.state.boardState[index] +
                        this.state.boardState[index + 4] +
                        this.state.boardState[index + 8]
                    );
                    if (
                        val == this.state.boardState[index] &&
                        val == this.state.boardState[index + 4] &&
                        val == this.state.boardState[index + 8]
                    ) {
                        console.log("declared3");
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
            <View style={{ marginTop: 200, marginLeft: 100, width: 200 }}>
                <View>
                    <Text style={boardStyles.gameName} >TicTacToe</Text>
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
                    {this.state.noticeMessage.trim().length > 0 && (Alert.alert(
                        "",
                        this.state.noticeMessage,
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false })
                    )
                    }
                </View>
            </View>
        );
    }
}

class Square extends Component {
    render() {
        return (
            <View style={squareStyles.main}>

                <Text style={squareStyles.block} onPress={() => this.props.updateState()}>
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

        fontWeight: 'bold',
        fontSize: 20,
        borderWidth: 0.4,
        height: 60,
        textAlignVertical: "center",
        textAlign: "center"



    }
});
const boardStyles = StyleSheet.create({
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
        textAlign: 'center', // <-- the magic
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 10,
        fontFamily: "arial"

    },
    gameName: {
        textAlign: 'center', // <-- the magic
        fontSize: 20,
        marginBottom: 30,
        color: "black"
    }
});

export { TicTacToeBoard };
