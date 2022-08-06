/// <reference types="cypress"/>

import inputData from "../fixtures/data/inputData.json";
import { onDeleteFunctions } from "../support/utils/delete";
import { onCreateFunctions } from "../support/utils/create";
import { onApiCalls } from "../support/utils/apiCalls";

describe("Test get request, if the correct data is listed after creating, updating and deleting data", () => {
  const createText = "NEWLY CREATED";
  const updateText = "UPDATED SUCCESSFULLY";

  beforeEach(
    "Delete input entries if they exist, created before this test",
    () => {
      onDeleteFunctions.deleteVariableEntry();
      onDeleteFunctions.deleteLastEntry(); // IN CASE THE QUOTA IS REACHED, DELETE THE LAST ENTRY
    }
  );
  after("Delete input entries, created by this test", () => {
    onDeleteFunctions.deleteVariableEntry();
  });

  it("Add 1 entry and check if it's listed in the 'get' response", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onApiCalls.get().then((getResponse) => {
        let listOfEntries = [];
        getResponse.body.map((entry) => {
          listOfEntries.push(entry.main_key);
        });
        expect(listOfEntries).to.include(inputData.entryKey + createText);
        expect(getResponse.status).to.eql(200);
      });
    });
  });

  it("Add and delete 1 entry and check if it's not listed in the 'get' response", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onApiCalls.delete(inputData.entryKey + createText).then(() => {
        onApiCalls.get().then((getResponse) => {
          let listOfEntries = [];
          getResponse.body.map((entry) => {
            listOfEntries.push(entry.main_key);
          });
          expect(listOfEntries).to.not.include(inputData.entryKey + createText);
          expect(getResponse.status).to.eql(200);
        });
      });
    });
  });

  it("Add and update 1 entry and check if it's listed in the 'get' response, with the updated 'value'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onApiCalls
        .update(
          inputData.entryKey + createText,
          inputData.entryValue + updateText
        )
        .then(() => {
          onApiCalls.get().then((getResponse) => {
            let listOfEntries = [];
            getResponse.body.map((entry) => {
              listOfEntries.push(entry.value);
            });
            expect(listOfEntries).to.include(inputData.entryValue + updateText);
            expect(getResponse.status).to.eql(200);
          });
        });
    });
  });
});
