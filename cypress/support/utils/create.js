import inputData from "../../fixtures/data/inputData.json";
import { onApiCalls } from "./apiCalls";

export class createFunctions {
  /**
   * - ADD 1 ENTRY WITH PROVIDED TEXT, THAT WILL BE ADDED TO 'entryKey' AND 'entryValue' VARIABLES
   * - VARIABLES THAT ARE USED FOR KEY AND VALUE ARE STORED IN cypress/fixtures/data/inputData.json
   */
  addOneEntry(textAddition) {
    return onApiCalls
      .put(
        // add 1 entry and check if the response is correct
        inputData.entryKey + textAddition,
        inputData.entryValue + textAddition
      )
      .then((putResponse) => {
        return putResponse;
      });
  }
}
export const onCreateFunctions = new createFunctions();
