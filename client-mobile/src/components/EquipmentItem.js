import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";

import colors from "../config/colors";
import fontSize from "../config/fontSize";

class EquipmentItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.number,
    imageURL: PropTypes.string,
    construction: PropTypes.string,
    address: PropTypes.string,
    requesterThumbnail: PropTypes.string,
    price: PropTypes.number
  };

  static defaultProps = {
    requesterThumbnail:
      "https://drupway.com/wp-content/uploads/2018/10/person-male.png"
  };

  render() {
    const {
      id,
      name,
      imageURL,
      address,
      price,
      onPress,
      requesterThumbnail,
      contractor,
      timeRange
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onPress}
          style={{ overflow: "hidden", borderRadius: 10 }}
        >
          <ImageCache
            uri={imageURL}
            style={{ height: 160 }}
            resizeMode={"cover"}
          />
          <View style={styles.titleWrapper}>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text style={styles.equipmentName}>{name}</Text>
              {contractor ? <Text>Contractor: {contractor}</Text> : null}

              {timeRange ? (
                <Text>
                  {timeRange.beginDate} To {timeRange.endDate}
                </Text>
              ) : null}

              <Text style={styles.equipmentStatus}>{address}</Text>
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.equipmentPrice}>{price} K</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: "#3E3E3E",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "white"
  },
  equipmentName: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  },
  equipmentStatus: {
    fontSize: fontSize.body,
    fontWeight: "400",
    color: colors.text50
  },
  equipmentPrice: {
    fontSize: fontSize.h2,
    fontWeight: "600",
    color: colors.text
  },
  priceWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  }
});

export default EquipmentItem;
