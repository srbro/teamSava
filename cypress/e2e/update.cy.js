/// <reference types="cypress"/>

import inputData from "../fixtures/data/inputData.json";
import { onDeleteFunctions } from "../support/utils/delete";
import { onCreateFunctions } from "../support/utils/create";
import { onApiCalls } from "../support/utils/apiCalls";

describe("Test updating entered data", () => {
  const createText = "SHOULD UPDATE";
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

  it("Add 1 entry and update a 'value' of a new entry", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onApiCalls
        .update(
          // update the entry value and check if the response is correct
          inputData.entryKey + createText,
          inputData.entryValue + updateText
        )
        .then((updateResponse) => {
          expect(updateResponse.body.main_key).to.eql(
            inputData.entryKey + createText
          );
          expect(updateResponse.body.value).to.eql(
            inputData.entryValue + updateText
          );
          expect(updateResponse.body[2]).to.not.exist;
          expect(updateResponse.status).to.eql(200);
        });
    });
  });

  it("Try to update not existing entry", () => {
    onApiCalls
      .update("NOT EXISTING KEY", "SOME TEXT")
      .then((updateResponse) => {
        expect(updateResponse.body).to.eql(inputData.errorTextNotExistingKey);
      });
  });

  it("Add 1 entry and send POST request with provided only the 'main_key'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      cy.request({
        url: inputData.exercise_api,
        body: {
          main_key: inputData.entryKey + createText,
        },
        method: "POST",
        failOnStatusCode: false,
      }).then((updateResponse) => {
        expect(updateResponse.body).to.eql(inputData.errorTextLackOfValue);
        expect(updateResponse.status).to.eql(400);
      });
    });
  });

  it("Add 1 entry and send POST request with provided only the 'value'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      cy.request({
        url: inputData.exercise_api,
        body: {
          value: inputData.entryValue + createText,
        },
        method: "POST",
        failOnStatusCode: false,
      }).then((updateResponse) => {
        expect(updateResponse.body).to.eql(inputData.errorTextLackOfKey);
        expect(updateResponse.status).to.eql(400);
      });
    });
  });
});
