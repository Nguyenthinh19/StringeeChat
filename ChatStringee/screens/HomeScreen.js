import React, { Component, useState, useEffect, useRef, createRef } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableOpacity,
    Keyboard,
    AsyncStorage
} from "react-native";
import ChatUtil from '../utils/ChatUtil';
import { StringeeClient } from 'stringee-react-native-chat';
import { connect } from 'react-redux';
import {
    updateUserStringee,
    getListConvs,
    onObjectChange,
} from '../redux/reducers/ChatSilce';

const user1 =
    'eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yLTE2MTg1NDg4NzIiLCJpc3MiOiJTS1U1Q01IeTdpcXM2Q0d6ZmNzYm5nQzJUV2tLNHBzTm1yIiwiZXhwIjoxNjIxMTQwODcyLCJ1c2VySWQiOiJ1c2VyMSJ9.xMbLGMyD0WCY88dhUL5PIpw1Pb-gfOq82tdrkHYn9Hw';
const user2 = "eyJjdHkiOiJzdHJpbmdlZS1hcGk7dj0xIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTS0xIb2NCdDl6Qk5qc1pLeThZaUVkSzRsU3NBZjhCSHpyLTE1OTAwNTEzNzQiLCJpc3MiOiJTS0xIb2NCdDl6Qk5qc1pLeThZaUVkSzRsU3NBZjhCSHpyIiwiZXhwIjoxNTkyNjQzMzc0LCJ1c2VySWQiOiJ1c2VyMiJ9.I2WHHUZ9LqnV31vLzRM3-hrNsce6Ax3AzsMvQhwIW_E";

const iOS = Platform.OS === "ios" ? true : false;


class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myUserId: "",
            callToUserId: "",
            hasConnected: false,
            token: this.props.route.params.token
        };

        this.clientEventHandlers = {
            onConnect: this.onDidConnect,
            onDisConnect: this.onDisConnect,
            onObjectChange: this.onObjectChange,
        };
    }
    onDidConnect = async (userInfo) => {

        this.setState({
            myUserId: userInfo.userId,
            hasConnected: true
        });
        console.log('userInfo', userInfo);
        await this.props.updateUserStringee(userInfo);
        await this.props.getListConvs();
    };

    onDisConnect = () => { };

    onObjectChange = ({ objectType, objectChanges, changeType }) => {
        const payload = { objectType, objectChanges, changeType };
        this.props.onObjectChange(payload);
    };

    componentWillMount() { }

    async componentDidMount() {
        ChatUtil.getStringeeClient().connect(this.state.token);

    }

    createConvs = () => {
        //  console.log('id',id);
        const userId = [this.state.callToUserId]
        const options = {
            isDistinct: true,
            isGroup: false,
            name: 'Hỗ trợ',
        };
        ChatUtil.getStringeeClient().createConversation(
            userId,
            options,
            (status, code, message, conv) => {
                console.log('CreatConvs', status, code, message, conv);
                this.props.getListConvs();
                this.props.navigation.navigate('ConvsDetail', {
                    item: conv,
                    conversationName: options.name,
                });
            })

    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    React Native wrapper for Stringee mobile SDK!
                </Text>

                <Text style={styles.info}>Logged in as: {this.state.myUserId}</Text>

                <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    autoCapitalize="none"
                    value={this.state.callToUserId}
                    placeholder="Make a call to userId"
                    onChangeText={text => this.setState({ callToUserId: text })}
                />

                <View style={styles.buttonView}>
                    {/* <TouchableOpacity
                        style={styles.button}
                        onPress={this._onVoiceCallButtonPress}
                    >
                        <Text style={styles.text}>Voice Call</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.createConvs}
                    >
                        <Text style={styles.text}>Chat</Text>
                    </TouchableOpacity>
                </View>
                <StringeeClient
                    ref={stringeClient => ChatUtil.setStringeeClient(stringeClient)}
                    eventHandlers={this.clientEventHandlers}
                />

                {/* <StringeeClient ref="client" eventHandlers={this.clientEventHandlers} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        fontWeight: "bold"
    },
    info: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
        fontWeight: "bold",
        color: "red"
    },

    text: {
        textAlign: "center",
        color: "#F5FCFF",
        marginBottom: 5,
        fontWeight: "bold",
        fontSize: 15
    },

    input: {
        height: 35,
        width: 280,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 20,
        textAlign: "center",
        backgroundColor: "#ECECEC"
    },

    button: {
        width: 120,
        height: 40,
        marginTop: 40,
        paddingTop: 10,
        // paddingBottom: ,
        backgroundColor: "#1E6738",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#fff"
    },

    buttonView: {
        width: 280,
        height: 80,
        flexDirection: "row",
        justifyContent: "center"
    }
});

const mapStateToProps = state => ({
    chatState: state.chatReducer,
});

const mapDispatchToProps = {
    updateUserStringee,
    getListConvs,
    onObjectChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);