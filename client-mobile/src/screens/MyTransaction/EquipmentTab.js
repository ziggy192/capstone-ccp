import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  listTransactionBySupplier,
  listMaterialTransactionBySupplier,
  clearSupplierTransactionList
} from "../../redux/actions/transaction";

import RequireLogin from "../Login/RequireLogin";
import TabView from "../../components/TabView";
import ParallaxList from "../../components/ParallaxList";
import Dropdown from "../../components/Dropdown";
import Button from "../../components/Button";
import TransactionItem from "../../components/TransactionItem";
import EquipmentStatus from "../../components/EquipmentStatus";
import Header from "../../components/Header";
import Loading from "../../components/Loading";

import colors from "../../config/colors";
import fontSize from "../../config/fontSize";

const { width, height } = Dimensions.get("window");

const TRANSACTION_STATUSES = [
  {
    code: "PENDING",
    title: "Pending" // On Waiting,
  },
  {
    code: "ACCEPTED",
    title: "Accepted"
  },
  {
    code: "PROCESSING",
    title: "Processing"
  },
  {
    code: "FINISHED",
    title: "Finished"
  },
  {
    code: "DENIED",
    title: "Denied"
  },
  {
    code: "CANCEL",
    title: "Cancel"
  }
];

const DROPDOWN_OPTIONS = [
  {
    id: 0,
    name: "All",
    value: "All"
  },
  {
    id: 1,
    name: "Pending",
    value: "Pending"
  },
  {
    id: 2,
    name: "Accepted",
    value: "Accepted"
  },
  {
    id: 3,
    name: "Processing",
    value: "Processing"
  },
  {
    id: 4,
    name: "Finished",
    value: "Finished"
  },
  {
    id: 5,
    name: "Denied",
    value: "Denied"
  },
  {
    id: 6,
    name: "Cancel",
    value: "Cancel"
  }
];

const COLORS = {
  AVAILABLE: "#4DB781",
  ACCEPTED: "#4DB781", //green
  DENIED: "#FF5C5C", //red
  CANCEL: "#FF5C5C",
  PENDING: "#F9AA33",
  RENTING: "#7199FE",
  DELIVERING: "#7199FE",
  WAITING_FOR_RETURNING: "#7199FE",
  FINISHED: "#FFDF49",
  PROCESSING: "#7199FE",
  default: "#3E3E3E"
  // blue: 7199FE, yellow: FFDF49
};

const EQUIPMENT_STATUS = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  CANCEL: "Cancel",
  DELIVERING: "Delivering",
  RENTING: "Renting",
  WAITING_FOR_RETURNING: "Returning",
  FINISHED: "Returned"
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

@connect(
  state => {
    return {
      listTransaction: state.transaction.listSupplierTransaction,
      listMaterial: state.transaction.listSupplierMaterial,
      loading: state.transaction.loading,
      error: state.transaction.error,
      user: state.auth.data,
      isLoggedIn: state.auth.userIsLoggin,
      token: state.auth.token
    };
  },
  dispatch => ({
    fetchListMyTransaction: contractorId => {
      dispatch(listTransactionBySupplier(contractorId));
    },
    fetchListMaterial: contractorId => {
      dispatch(listMaterialTransactionBySupplier(contractorId));
    },
    fetchClearMyTransaction: supplierId => {
      dispatch(clearSupplierTransactionList(supplierId));
    }
  })
)
class EquipmentTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "All",
      loading: true,
      id: null,
      transactionStatus: "",
      refreshing: false,
      activeTab: 0
    };
  }

  _showAlert = (title, msg) => {
    Alert.alert(title, msg, [{ text: "OK" }], {
      cancelable: true
    });
  };

  _onChangeTab = tab => {
    this.setState({ activeTab: tab });
  };

  _capitalizeCharacter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  _formatDate = date => {
    let newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let newMonth = month < 10 ? "0" + month : month;
    let day = newDate.getDate();
    let newDay = day < 10 ? "0" + day : day;
    let dayOfWeek = weekDays[newDate.getDay()];

    return dayOfWeek + ", " + newDay + "/" + newMonth + "/" + year;
  };

  _handleOnPressItem = id => {
    this.setState({ id });
  };

  _handleAddPress = () => {
    this.props.navigation.navigate("AddDetail");
  };

  _getEquipementByStatus = status => {
    const { listTransaction } = this.props;
    return listTransaction.filter(item => item.status === status) || [];
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    const { user } = this.props;
    const res = await this.props.fetchListMyTransaction(user.contractor.id);
    if (res) {
      this.setState({ refreshing: false });
    } else {
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    }
  };

  _handleFilter = () => {
    if (this.state.status === "All") {
      return TRANSACTION_STATUSES;
    } else {
      return TRANSACTION_STATUSES.filter(
        status => status.code === this.state.status.toUpperCase()
      );
    }
  };

  _renderBottomStatus = (transactionStatus, equipmentStatus) => {
    if (transactionStatus !== "DENIED") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              marginRight: 5,
              backgroundColor: COLORS[equipmentStatus || "default"]
            }}
          />
          <Text style={styles.text}>
            Equipment status: {EQUIPMENT_STATUS[equipmentStatus]}
          </Text>
        </View>
      );
    }
    return null;
  };

  _renderAllTransaction = () => (
    <View>
      {this._handleFilter().map((status, idx) => {
        const equipmentList = this._getEquipementByStatus(status.code);
        //Hide section if there is no equipment
        if (equipmentList.length === 0) return null;

        // Otherwise, display the whole list
        return (
          <View key={`sec_${idx}`}>
            <EquipmentStatus
              count={equipmentList.length}
              title={status.title}
              code={status.code}
            />
            {equipmentList.map((item, index) => (
              <View key={`eq_${item.id}`} style={styles.rowWrapper}>
                <TransactionItem
                  onPress={() =>
                    this.props.navigation.navigate("MyTransactionDetail", {
                      id: item.id
                    })
                  }
                  role={"Requester"}
                  id={item.id}
                  name={item.equipment.name}
                  imageURL={
                    "https://www.extremesandbox.com/wp-content/uploads/Extreme-Sandbox-Corportate-Events-Excavator-Lifting-Car.jpg"
                  }
                  avatarURL={
                    "https://cdn.iconscout.com/icon/free/png-256/avatar-369-456321.png"
                  }
                  status={this._capitalizeCharacter(item.status)}
                  statusBackgroundColor={COLORS[item.status]}
                  contractor={item.requester.name}
                  phone={item.requester.phoneNumber}
                  beginDate={this._formatDate(item.beginDate)}
                  endDate={this._formatDate(item.endDate)}
                  hasEquipmentStatus={this._renderBottomStatus(
                    item.status,
                    item.equipment.status
                  )}
                />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  _renderEquipment = listTransaction => {
    const { status } = this.state;
    return (
      <View style={styles.scrollWrapper}>
        {listTransaction.length > 0 ? (
          <View>
            <Dropdown
              label={"Status"}
              defaultText={"All"}
              onSelectValue={value => this.setState({ status: value })}
              options={DROPDOWN_OPTIONS}
              isHorizontal={true}
            />
            {this._renderAllTransaction()}
          </View>
        ) : (
          <Text>No Data</Text>
        )}
      </View>
    );
  };

  render() {
    const { listTransaction } = this.props;
    return (
        this._renderEquipment(listTransaction)
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.secondaryColorOpacity,
    marginVertical: 15,
    padding: 10
  },
  scrollContent: {
    flex: 0,
    paddingHorizontal: 15,
    paddingTop: 20
  },
  equipmentItemContainer: {
    paddingVertical: 8
  },
  title: {
    fontSize: fontSize.h4,
    fontWeight: "600"
  },
  header: {
    fontSize: fontSize.h4,
    fontWeight: "500",
    color: colors.text
  },
  text: {
    fontSize: fontSize.bodyText
  }
});

export default EquipmentTab;
