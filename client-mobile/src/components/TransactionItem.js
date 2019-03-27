import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Image as ImageCache } from "react-native-expo-image-cache";
import { Entypo, Ionicons } from "@expo/vector-icons";
import moment from 'moment';

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

    // Calculate date differences
    const end = moment(endDate);
    const begin = moment(beginDate);
    const duration = moment.duration(end.diff(begin));
    const days = duration.asDays() + 1;

    return (
      <TouchableOpacity style={[styles.container, containerStyle]}>
        <View style={{flexDirection: 'column', flex: 1 }}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <ImageCache
              uri={avatarURL}
              style={styles.avatar}
              resizeMode={"cover"}
            />
            <View style={{flexDirection: 'column', marginHorizontal: 8, flex: 1 }}>
              <Text style={styles.contractorName}>{contractor}</Text>
              <Text style={styles.equipmentName}>▶ {name}</Text>
            </View>
          </View>
          <View style={{ marginTop: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/icons/icons8-calendar.png')}
                style={styles.calendarIcon}
                resizeMode={"contain"}
              />
              <Text style={styles.duration}>{`${days} ${days > 1 ? 'days' : 'day'}`}</Text>
            </View>
            <Text style={styles.startEndDate}>{begin.format('DD/MM/YY')} - {end.format('DD/MM/YY')}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 3 }}>
              <Image
                source={require('../../assets/icons/icons8-rounded_rectangle.png')}
                style={[styles.statusIcon, {tintColor: statusBackgroundColor}]}
                resizeMode={"contain"}
              />
              <Text style={styles.duration}>{status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.equipmentThumbnailWrapper}>
          <ImageCache
            uri={imageURL}
            style={styles.equipmentThumbnail}
            resizeMode={"cover"}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingRight: 0,
  },
  avatar: {
    height: 36,
    aspectRatio: 1,
    borderRadius: 15
  },
  contractorName: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
  },
  equipmentName: {
    fontSize: fontSize.caption,
    color: colors.text68,
    fontWeight: "500",
    // alignSelf: 'flex-end'
  },
  equipmentThumbnailWrapper: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: -10,
    overflow: 'hidden'
  },
  equipmentThumbnail: {
    width: 90,
    flex: 1,
  },
  calendarIcon: {
    width: 15,
    aspectRatio: 1,
    tintColor: colors.text50,
    marginRight: 3
  },
  duration: {
    fontSize: fontSize.caption,
    color: colors.text50,
    fontWeight: "500",
  },
  startEndDate: {
    fontSize: fontSize.caption,
    color: colors.text,
    fontWeight: "600",
    marginLeft: 15 + 3,
    marginTop: 3,
  },
  statusIcon: {
    width: 13,
    height: 15,
    tintColor: colors.text50,
    marginRight: 4,
    marginLeft: 1,
  }
});

export default TransactionItem;
