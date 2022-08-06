/// <reference types="cypress"/>

import inputData from "../fixtures/data/inputData.json";
import { onDeleteFunctions } from "../support/utils/delete";
import { onCreateFunctions } from "../support/utils/create";
import { onApiCalls } from "../support/utils/apiCalls";

describe("Test deleting entries", () => {
  const createText = "SHOULD DELETE";
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

  it("Add 1 entry and delete it, with provided only 'main_key'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onApiCalls
        .delete(
          // delete the entry and check if the response is correct
          inputData.entryKey + createText
        )
        .then((deleteResponse) => {
          expect(deleteResponse.body.main_key).to.eql(
            inputData.entryKey + createText
          );
          expect(deleteResponse.body.value).to.not.exist;
          expect(deleteResponse.body[1]).to.not.exist;
          expect(deleteResponse.status).to.eql(200);
        });
    });
  });

  it("Add 1 entry and delete it, with provided only 'value'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      cy.request({
        url: inputData.exercise_api,
        body: {
          value: inputData.entryValue + createText,
        },
        method: "DELETE",
        failOnStatusCode: false,
      }).then((deleteResponse) => {
        expect(deleteResponse.body).to.eql(inputData.errorTextLackOfKey);
        expect(deleteResponse.status).to.eql(400);
      });
    });
  });

  it("Add 1 entry and delete it, with provided 'main_key' and 'value'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      cy.request({
        url: inputData.exercise_api,
        body: {
          value: inputData.entryValue + createText,
          main_key: inputData.entryKey + createText,
        },
        method: "DELETE",
        failOnStatusCode: false,
      }).then((deleteResponse) => {
        expect(deleteResponse.body.main_key).to.eql(
          inputData.entryKey + createText
        );
        expect(deleteResponse.body.value).to.eql(
          inputData.entryValue + createText
        );
        expect(deleteResponse.body[2]).to.not.exist;
        expect(deleteResponse.status).to.eql(200);
      });
    });
  });

  it("Add 1 entry and delete it, with provided empty string", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      // try to delete the entry and check if the response is correct
      onApiCalls.delete().then((deleteResponse) => {
        expect(deleteResponse.body).to.eql(inputData.errorTextLackOfKey);
        expect(deleteResponse.status).to.eql(400);
      });
    });
  });

  it("Add 1 entry, update it's value and delete it, with provided 'main_key'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      // Now update the value of the newly entered data
      onApiCalls
        .update(
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
          // Delete the updated entry
          onApiCalls
            .delete(
              // delete the entry and check if the response is correct
              inputData.entryKey + createText
            )
            .then((deleteResponse) => {
              expect(deleteResponse.body.main_key).to.eql(
                inputData.entryKey + createText
              );
              expect(deleteResponse.body.value).to.not.exist;
              expect(deleteResponse.body[1]).to.not.exist;
              expect(deleteResponse.status).to.eql(200);
            });
        });
    });
  });
});
