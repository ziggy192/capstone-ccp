import axios from "axios";
import StatusAction from "./status";
import * as Actions from "../types";
import { CART_CHECK_OUT } from "../types";

export function listTransactionBySupplier(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_SUPPLIER_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(
        `transactions/supplier/${contractorId}?orderBy=createdTime.desc`
      );
      dispatch({
        type: Actions.LIST_SUPPLIER_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.LIST_SUPPLIER_TRANSACTION.ERROR
      });
    }
  };
}

export function listTransactionByRequester(contractorId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_REQUESTER_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(
        `transactions/requester/${contractorId}?orderBy=createdTime.desc`
      );
      dispatch({
        type: Actions.LIST_REQUESTER_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.LIST_REQUESTER_TRANSACTION.ERROR
      });
    }
  };
}

export function sendTransactionRequest(transaction) {
  return async dispatch => {
    const res = await axios.post(`transactions`, transaction);
    dispatch({
      type: Actions.SEND_TRANSACTION_REQUEST.SUCCESS,
      payload: res
    });
    dispatch(
      StatusAction.success(
        "Your booking has been sent successfully",
        Date.now()
      )
    );
  };
}

export function requestTransaction(id, transactionStatus) {
  return async dispatch => {
    try {
      dispatch({ type: Actions.REQUEST_TRANSACTION.REQUEST });
      const res = await axios.put(`transactions/${id}`, transactionStatus);
      dispatch({
        type: Actions.REQUEST_TRANSACTION.SUCCESS,
        payload: { data: res, id: id }
      });
      dispatch(StatusAction.success("Request success", Date.now()));
    } catch (error) {
      dispatch({ type: Actions.REQUEST_TRANSACTION.ERROR });
    }
  };
}

export function getTransactionDetail(id) {
  return async dispatch => {
    try {
      dispatch({ type: Actions.GET_TRANSACTION_DETAIL.REQUEST });
      const res = await axios.get(`transactions/${id}`);
      dispatch({
        type: Actions.GET_TRANSACTION_DETAIL.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({ type: Actions.GET_TRANSACTION_DETAIL.ERROR });
    }
  };
}

export function getAdjustTransaction(transactionId) {
  return async dispatch => {
    dispatch({
      type: Actions.GET_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.get(
      `transactionDateChangeRequests?transactionId=${transactionId}`
    );
    dispatch({
      type: Actions.GET_ADJUST_TRANSACTION.SUCCESS,
      payload: res
    });
  };
}

export function sendAdjustTransaction(transactionId, date) {
  return async dispatch => {
    dispatch({
      type: Actions.SEND_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.post(
      `transactions/${transactionId}/adjustDateRequests`,
      date
    );
    dispatch({
      type: Actions.SEND_ADJUST_TRANSACTION.SUCCESS,
      payload: { data: res, id: transactionId }
    });
  };
}

export function requestAdjustTransaction(date, transactionId) {
  return async dispatch => {
    console.log(date);
    try {
      dispatch({
        type: Actions.REQUEST_ADJUST_TRANSACTION.REQUEST,
        payload: { id: transactionId }
      });
      const res = await axios.post(`transactionDateChangeRequests`, date);
      dispatch({
        type: Actions.REQUEST_ADJUST_TRANSACTION.SUCCESS,
        payload: { data: res, id: transactionId }
      });
      dispatch(StatusAction.success("Request success", Date.now()));
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.REQUEST_ADJUST_TRANSACTION.ERROR
      });
    }
  };
}

export function responseAdjustTransaction(adjustTransactionId, status) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.RESPONSE_ADJUST_TRANSACTION.REQUEST
      });
      const res = await axios.put(
        `transactionDateChangeRequests/${adjustTransactionId}`,
        status
      );
      dispatch({
        type: Actions.RESPONSE_ADJUST_TRANSACTION.SUCCESS,
        payload: { data: res, id: adjustTransactionId }
      });
      dispatch(
        StatusAction.success(
          "Your adjust transaction date has been updated!!",
          Date.now()
        )
      );
    } catch (error) {
      dispatch({
        type: Actions.RESPONSE_ADJUST_TRANSACTION.ERROR
      });
    }
  };
}

export function deleteAdjustTransaction(transactionId) {
  return async dispatch => {
    dispatch({
      type: Actions.DELETE_ADJUST_TRANSACTION.REQUEST
    });
    const res = await axios.delete(
      `transactions/${transactionId}/adjustDateRequests`
    );
    dispatch({
      type: Actions.DELETE_ADJUST_TRANSACTION.SUCCESS,
      payload: { data: res, id: transactionId }
    });
  };
}

export function cancelTransaction(id) {
  return async dispatch => {
    const res = await axios.delete(`transactions/${id}`);
    dispatch({
      type: Actions.CANCEL_TRANSACTION.SUCCESS,
      payload: { id }
    });
    dispatch(StatusAction.success("Send success", Date.now()));
  };
}

export function clearSupplierTransactionList() {
  return {
    type: Actions.CLEAR_SUPPLIER_TRANSACTION_SUCCESS
  };
}

export function listMaterialTransactionBySupplier(supplierId) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.REQUEST
      });
      const res = await axios.get(
        `materialTransactions/supplier/${supplierId}?orderBy=createdTime.desc`
      );
      dispatch({
        type: Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.LIST_SUPPLIER_MATERIAL_TRANSACTION.ERROR
      });
    }
  };
}

export function listMaterialTransactionByRequester(requesterId) {
  return async dispatch => {
    dispatch({
      type: Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.REQUEST
    });
    try {
      const res = await axios.get(
        `materialTransactions/requester/${requesterId}?orderBy=createdTime.desc`
      );
      dispatch({
        type: Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.LIST_REQUESTER_MATERIAL_TRANSACTION.ERROR
      });
    }
  };
}

export function requestMaterialTransaction(material) {
  return async dispatch => {
    dispatch({
      type: Actions.SEND_MATERIAL_TRANSACTION_REQUEST.REQUEST
    });
    const res = await axios.post(`materialTransactions`, material);
    dispatch({
      type: Actions.SEND_MATERIAL_TRANSACTION_REQUEST.SUCCESS,
      payload: res
    });
    dispatch(StatusAction.success("Success", Date.now()));
  };
}

export function changeMaterialTransactionRequest(requestId, request, role) {
  return async dispatch => {
    dispatch({
      type: Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.REQUEST
    });
    const res = await axios.put(`materialTransactions/${requestId}`, request);
    dispatch({
      type: Actions.CHANGE_MATERIAL_TRANSACTION_REQUEST.SUCCESS,
      payload: { data: res, id: requestId, role }
    });
  };
}

//DEBRIS
export function listDebrisTransactionBySupplier() {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.GET_DEBRIS_TRANSACTION_BY_SUPPLIER.REQUEST
      });
      const res = await axios.get(
        "debrisTransactions/supplier?orderBy=createdTime.desc"
      );
      dispatch({
        type: Actions.GET_DEBRIS_TRANSACTION_BY_SUPPLIER.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.GET_DEBRIS_TRANSACTION_BY_SUPPLIER.ERROR
      });
    }
  };
}

export function listDebrisTransactionByRequester() {
  return async dispatch => {
    const res = await axios.get(
      "debrisTransactions/requester?orderBy=createdTime.desc"
    );
    dispatch({
      type: Actions.GET_DEBRIS_TRANSACTION_BY_REQUESTER.SUCCESS,
      payload: res
    });
  };
}

export function sendRequestDebrisTransaction(transaction) {
  return async dispatch => {
    const res = await axios.post("debrisTransactions", transaction);
    dispatch({
      type: Actions.SEND_REQUEST_DEBRIS_TRANSACTION.SUCCESS,
      payload: res
    });
    dispatch(StatusAction.success("Success", Date.now()));
  };
}

export function updateDebrisTransactionStatus(transactionId, status) {
  return async dispatch => {
    const res = await axios.put(`debrisTransactions/${transactionId}`, status);
    dispatch({
      type: Actions.UPDATE_DEBRIS_TRANSACTION_STATUS.SUCCESS,
      payload: { data: res, id: transactionId }
    });
    dispatch(StatusAction.success("Cancel success", Date.now()));
  };
}

export function sendEquipmentFeedback(transactionId, feedback) {
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEND_EQUIPMENT_FEEDBACK.REQUEST,
        payload: { id: transactionId }
      });
      const res = await axios.post(`equipmentFeedbacks`, feedback);
      dispatch(StatusAction.success("Send feedback success", Date.now()));
      dispatch({
        type: Actions.SEND_EQUIPMENT_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: Actions.SEND_EQUIPMENT_FEEDBACK.ERROR
      });
      dispatch(StatusAction.success("Send feedback fail", Date.now()));
    }
  };
}

export function sendMaterialFeedback(transactionId, materialId, feedback) {
  return async dispatch => {
    console.log(transactionId, materialId, feedback);
    try {
      dispatch({
        type: Actions.SEND_MATERIAL_FEEDBACK.REQUEST,
        payload: { id: transactionId }
      });
      const res = await axios.post(`materialFeedbacks`, feedback);
      dispatch({
        type: Actions.SEND_MATERIAL_FEEDBACK.SUCCESS,
        payload: { transactionId, materialId, data: res }
      });
    } catch (error) {
      dispatch({
        type: Actions.SEND_MATERIAL_FEEDBACK.ERROR
      });
    }
  };
}

export function sendDebrisFeedback(transactionId, feedback) {
  console.log(feedback);
  return async dispatch => {
    try {
      dispatch({
        type: Actions.SEND_DEBRIS_FEEDBACK.REQUEST,
        payload: { id: transactionId }
      });
      const res = await axios.post(`debrisFeedbacks`, feedback);
      dispatch({
        type: Actions.SEND_DEBRIS_FEEDBACK.SUCCESS,
        payload: res
      });
    } catch (error) {
      dispatch({
        type: Actions.SEND_DEBRIS_FEEDBACK.ERROR
      });
    }
  };
}
