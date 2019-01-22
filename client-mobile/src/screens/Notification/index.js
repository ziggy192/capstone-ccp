import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage, Button } from "react-native";
import { isSignedIn } from "../../config/auth";
import RequireLogin from "../Login/RequireLogin";
import Loading from "../../components/Loading";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentDidMount() {
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;
    const { navigation } = this.props;
    if (!checkedSignIn) {
      return <Loading />;
    }
    if (signedIn) {
      return (
        <View style={styles.container}>
          <Text>Notification</Text>
        </View>
      );
    } else {
      return <RequireLogin navigation={navigation} title={"Notification"} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Notification;
