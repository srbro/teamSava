import inputData from "../../fixtures/data/inputData.json";
import { onApiCalls } from "./apiCalls";

export class deleteFunctions {
  /**
   * - IF THE NUM OF ENTRIES IS 10, DELETE THE LAST ENTRY IN THE RESPONSE
   */
  deleteLastEntry() {
    onApiCalls.get().then((getResponse) => {
      const numOfEntries = getResponse.body.length;
      if (numOfEntries >= 10) {
        onApiCalls
          .delete(
            getResponse.body[numOfEntries - 1].main_key,
            getResponse.body[numOfEntries - 1].value
          )
          .then((deleteResponse) => {
            expect(deleteResponse.body.main_key).to.eql(
              getResponse.body[numOfEntries - 1].main_key
            );
            expect(deleteResponse.body.value).to.eql(
              getResponse.body[numOfEntries - 1].value
            );
            expect(deleteResponse.body[2]).to.not.exist;
          });
      }
    });
  }

  /**
   * - DELETE ALL OF THE ENTRIES WITH KEYS AND VALUES USED FOR THIS TEST
   * - VARIABLES THAT ARE USED FOR KEY AND VALUE ARE STORED IN cypress/fixtures/data/inputData.json
   */
  deleteVariableEntry() {
    // FETCH THE ENTRIES FROM GET REQUEST, CHECK IF THE 'inputData.entryKey'+anyNumber EXISTS AND DELETE IT
    onApiCalls.get().then((getResponseBefore) => {
      getResponseBefore.body.map((entryBefore) => {
        if (entryBefore.main_key.slice(0, 9) == inputData.entryKey) {
          onApiCalls.delete(entryBefore.main_key).then((deleteResponse) => {
            expect(deleteResponse.body.main_key).to.eql(entryBefore.main_key);
          });
        }
      });
      onApiCalls.get().then((getResponseAfter) => {
        getResponseAfter.body.map((entryAfter) => {
          expect(entryAfter.main_key.slice(0, 11)).not.eql(inputData.entryKey);
        });
      });
    });
  }
}

export const onDeleteFunctions = new deleteFunctions();
