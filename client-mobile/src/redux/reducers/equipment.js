import * as Actions from "../types";

const INITIAL_STATE = {
  loading: false,
  detail: {},
  equipment: []
};

export default function equipmentReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case Actions.EQUIPMENT_DETAIL_SUCCESS: {
      return {
        ...state,
        detail: payload
      };
    }
    case Actions.ADD_EQUIPMENT: {
      const id = state.equipment.length;
      const newEquipment = {
        id: id + 1,
        ...payload
      };
      return {
        equipment: [...state.equipment, newEquipment]
      };
    }
    case Actions.UPDATE_EQUIPMENT: {
      console.log(payload.status);
      return {
        equipment: state.equipment.map(item => {
          if (item.id === payload.id)
            return Object.assign({}, item, { status: payload.status });
          return item;
        })
      };
    }
    case Actions.REMOVE_EQUIPMENT:
      return {
        equipment: state.equipment.filter(x => x.id !== action.id)
      };
    default:
      return state;
  }
}
