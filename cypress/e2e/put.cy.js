/// <reference types="cypress"/>

import inputData from "../fixtures/data/inputData.json";
import { onDeleteFunctions } from "../support/utils/delete";
import { onApiCalls } from "../support/utils/apiCalls";
import { onCreateFunctions } from "../support/utils/create";

describe("Test adding new entries", () => {
  const createText = "NEWLY CREATED";

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

  it(
    "Test adding entries until the quota is reached -> quota = " +
      inputData.quota,
    () => {
      // DELETE THE LAST ENTRY, IN CASE THERE ARE 10 OF THEM, SO AT LEAST 1 ENTRY CAN BE MADE
      onDeleteFunctions.deleteLastEntry();

      // ADD NUMBER OF ENTRIES, UP TO QUOTA LIMIT - DEFINE quota IN cypress/fixtures/data/inputData.json
      onApiCalls
        .get()
        .then((getResponse) => {
          const numOfEntries = getResponse.body.length;

          for (let i = 1; i <= inputData.quota - numOfEntries; i++) {
            onApiCalls
              .put(inputData.entryKey + i, inputData.entryValue + i)
              .then((putResponse) => {
                expect(putResponse.body.main_key).to.eql(
                  inputData.entryKey + i
                );
                expect(putResponse.body.value).to.eql(inputData.entryValue + i);
                expect(putResponse.body[2]).to.not.exist;
                expect(putResponse.status).to.eql(200);
              });
          }
        })
        .then(() => {
          // ADD ONE MORE ENTRY AND EXPECT ERROR TEXT
          onCreateFunctions.addOneEntry(createText).then((putResponse) => {
            expect(putResponse.body).to.eql(inputData.errorTextReachedQuota);
            expect(putResponse.status).to.eql(400);
          });
        });
    }
  );

  it("Add 1 entry and try to add another, with the same 'main_key'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onCreateFunctions.addOneEntry(createText).then((putResponse) => {
        expect(putResponse.body).to.eql(inputData.errorTextExistingKey);
        expect(putResponse.status).to.eql(400);
      });
    });
  });

  it("Add 1 entry and send PUT request with provided only the 'main_key'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      cy.request({
        url: inputData.exercise_api,
        body: {
          main_key: inputData.entryKey + createText,
        },
        method: "PUT",
        failOnStatusCode: false,
      }).then((putResponse) => {
        expect(putResponse.body).to.eql(inputData.errorTextLackOfValue);
        expect(putResponse.status).to.eql(400);
      });
    });
  });

  it("Add 1 entry and send PUT request with provided only the 'value'", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      cy.request({
        url: inputData.exercise_api,
        body: {
          value: inputData.entryValue + createText,
        },
        method: "PUT",
        failOnStatusCode: false,
      }).then((putResponse) => {
        expect(putResponse.body).to.eql(inputData.errorTextLackOfKey);
        expect(putResponse.status).to.eql(400);
      });
    });
  });

  it("Add 1 entry and send PUT request with provided empty string", () => {
    onCreateFunctions.addOneEntry(createText).then(() => {
      onApiCalls.put().then((putResponse) => {
        expect(putResponse.body).to.eql(inputData.errorTextLackOfKey);
        expect(putResponse.status).to.eql(400);
      });
    });
  });
});
