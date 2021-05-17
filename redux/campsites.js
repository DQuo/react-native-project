import * as ActionTypes from './ActionTypes';

export const campsites = function(
  state = {
    isLoading: true,
    errMess: null,
    campsites: []
  },
  action ) {

    switch (action.type) {
      case ActionTypes.ADD_COMMENTS: {
        return {...state, errMess: null, comments: action.payload};
      }

      case ActionTypes.COMMENTS_FAILED: {
        return {...state, errMess: action.payload};
      }

      default: {
        return state;
      }
    }
}