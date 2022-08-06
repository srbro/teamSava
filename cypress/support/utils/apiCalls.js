import endPoints from "../../fixtures/data/endPoints.json";

export class apiCalls {
  /**
   * - SEND GET REQUEST AND RETURN THE RESPONSE
   */
  get() {
    return cy
      .request({
        url: endPoints.exercise_api,
        method: "GET",
        failOnStatusCode: false,
      })
      .then((response) => {
        return response;
      });
  }

  /**
   * - SEND PUT REQUEST AND RETURN THE RESPONSE
   * - FUNCTION RECEIVES KEY AND VALUE ARGS
   */
  put(newEntryKey, newEntryValue) {
    return cy
      .request({
        url: endPoints.exercise_api,
        body: {
          value: newEntryValue,
          main_key: newEntryKey,
        },
        method: "PUT",
        failOnStatusCode: false,
      })
      .then((response) => {
        return response;
      });
  }

  /**
   * - SEND UPDATE REQUEST AND RETURN THE RESPONSE
   * - FUNCTION RECEIVES KEY AND VALUE ARGS
   */
  update(newEntryKey, newEntryValue) {
    return cy
      .request({
        url: endPoints.exercise_api,
        body: {
          value: newEntryValue,
          main_key: newEntryKey,
        },
        method: "POST",
        failOnStatusCode: false,
      })
      .then((response) => {
        return response;
      });
  }

  /**
   * - SEND DELETE REQUEST AND RETURN THE RESPONSE
   * - FUNCTION RECEIVES KEY AND VALUE ARGS
   */
  delete(newEntryKey) {
    return cy
      .request({
        url: endPoints.exercise_api,
        body: {
          main_key: newEntryKey,
        },
        method: "DELETE",
        failOnStatusCode: false,
      })
      .then((response) => {
        return response;
      });
  }
}

export const onApiCalls = new apiCalls();
