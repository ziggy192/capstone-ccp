import React, { PureComponent } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Alert
} from "react-native";
import {
  getSubscriptions,
  deleteSubscription
} from "../../redux/actions/subscription";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import Feather from "@expo/vector-icons/Feather";

import ParallaxList from "../../components/ParallaxList";
import {
  Header,
  Left,
  Right,
  Button as HeaderButton,
  Body
} from "../../components/AnimatedHeader";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

@connect(
  state => ({
    subscription: state.subscription,
    user: state.auth.data
  }),
  dispatch => ({
    getSubscriptions: () => dispatch(getSubscriptions()),
    deleteSubscription: id => dispatch(deleteSubscription(id))
  })
)
class Subscription extends PureComponent {
  componentDidMount() {
    this.props.getSubscriptions();
  }

  _handleGoBack = () => {
    this.props.navigation.goBack();
  };

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _handleAddNewSubscription = () => {
    const { user } = this.props;
    if (user.contractor.status !== "NOT_VERIFIED") {
      this.props.navigation.navigate("AddSubscription");
    } else {
      this._showAlert(
        "Nani kore...",
        `Your account is not verified to access this action`
      );
    }
  };

  _renderScrollViewItem = () => {
    const { listSubscription } = this.props.subscription;
    console.log(listSubscription);
    return (
      <View>
        {listSubscription.length > 0 ? (
          listSubscription.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  this.props.navigation.navigate("EditSubscription", {
                    id: item.id
                  })
                }
                style={{
                  marginTop: 10,
                  marginHorizontal: 15,
                  ...colors.shadow
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10
                  }}
                >
                  <View style={{ flex: 4 }}>
                    <Text style={styles.text}>ID: {item.id}</Text>
                    <Text style={styles.text}>Max price: {item.maxPrice}</Text>
                    <Text style={styles.text}>
                      Max distance: {item.maxDistance}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={require("../../../assets/icons/icons8-calendar.png")}
                        style={styles.calendarIcon}
                        resizeMode={"contain"}
                      />
                      <Text style={styles.text}>
                        {item.beginDate} ▶ {item.endDate}
                      </Text>
                    </View>
                    <Text style={styles.address}>{item.address}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.props.deleteSubscription(item.id)}
                  >
                    <Feather
                      name={"x"}
                      size={22}
                      color={colors.secondaryColor}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.actionWrapper}>
            <Text style={styles.title}>No Data</Text>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { user } = this.props;
    const { listSubscription } = this.props.subscription;
    if (!listSubscription) return <Loading />;

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ bottom: "always", top: "always" }}
      >
        <View style={{ flex: 1 }}>
          <ParallaxList
            title={"Manage subscription"}
            hasLeft={true}
            hasCart={false}
            hasAdd={true}
            onAddPress={this._handleAddNewSubscription}
            scrollElement={<Animated.ScrollView />}
            renderScrollItem={this._renderScrollViewItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: 400,
    borderRadius: 9,
    borderStyle: "dashed",
    borderWidth: 3,
    borderColor: "#DEE4E3",
    padding: 30,
    marginHorizontal: 15,
    marginTop: 15
  },
  title: {
    fontSize: fontSize.bodyText,
    fontWeight: "600",
    color: colors.text
  },
  text: {
    fontSize: fontSize.secondaryText,
    fontWeight: "500",
    color: colors.text
  },
  address: {
    fontSize: fontSize.secondaryText,
    color: colors.text68
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
  }
});

export default Subscription;
