import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { Entypo, Ionicons } from "@expo/vector-icons";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class TransactionItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    contractor: PropTypes.string,
    phone: PropTypes.string,
    beginDate: PropTypes.string,
    endDate: PropTypes.string
  };

  render() {
    const {
      id,
      name,
      imageURL,
      contractor,
      phone,
      beginDate,
      endDate,
      onPress,
      status,
      statusBackgroundColor,
      avatarURL,
      role,
      hasEquipmentStatus,
      containerStyle
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity style={{ flexDirection: "column" }} onPress={onPress}>
          <View style={styles.wrapper}>
            <Image
              source={{ uri: imageURL }}
              resizeMode={"cover"}
              style={[styles.image, { width: 120, borderRadius: 10 }]}
            />
            <View style={styles.contentWrapper}>
              <View
                style={[
                  styles.statusWrapper,
                  { backgroundColor: statusBackgroundColor }
                ]}
              >
                <Text style={styles.statusText}>{status}</Text>
              </View>
              <Text style={styles.title}>{name}</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Text style={styles.text}>{role}</Text>
                <Text style={styles.text}>{contractor}</Text>
              </View>
            </View>
            <ImageCache
              uri={avatarURL}
              style={styles.avatar}
              resizeMode={"cover"}
            />
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.text}>
              {beginDate} - {endDate}
            </Text>
          </View>
          {hasEquipmentStatus ? hasEquipmentStatus : null}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flexDirection: "row"
  },
  contentWrapper: {
    flex: 2,
    flexDirection: "column",
    paddingLeft: 10
  },
  dateWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  statusWrapper: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 25,
    width: 80,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginBottom: 10
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    marginBottom: 10
  },
  text: {
    fontSize: fontSize.bodyText,
    fontWeight: "500"
  },
  statusText: {
    fontSize: fontSize.caption,
    fontWeight: "bold",
    color: "white"
  },
  image: {
    height: 90
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});

export default TransactionItem;