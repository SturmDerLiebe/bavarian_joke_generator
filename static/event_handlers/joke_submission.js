"use strict";

import { CONTENT_PATTERN, EXPLANATION_PATTERN } from "../../RegEx/textarea.js";
import { handle_login } from "./login.js";

/** Higher Order Function to pass elements to the submit handler function
  * @param submit_form {HTMLFormElement}
  * @param content_field {HTMLTextAreaElement}
  * @param explanation_field {HTMLTextAreaElement}
  * @returns {(event: SubmitEvent) => void} Submit handler function with scoped element arguments
  */
function get_submit_joke_handler(submit_form, content_field, explanation_field) {
  return (
    async function submit_joke_handler(event) {
      try {
        // Check and report Validity of both textareas:
        if (
          !(
            handle_validity_check(
              content_field,
              CONTENT_PATTERN,
              submit_form,
              "For Content only use German letters and punctuation!",
            ) &&
            handle_validity_check(
              explanation_field,
              EXPLANATION_PATTERN,
              submit_form,
              "For Explanation only use English letters and punctuation!",
            )
          )
        ) {
          // End the function if inputs are invalid and cancel submit event
          return event.preventDefault();
        }
        // Only try yo authenticate when submission is not anonymous
        /* ————————————————— WebauthnLogin ————————————————————————————————————— */
        if (SUBMITTED_BY_INPUT.value.length) {
          event.preventDefault(); // Make sure to always call this after constraint validation succeeded via reportValidity(), to enable custom form submission
          await handle_login(SUBMITTED_BY_INPUT.value, event);
          submit_form.submit();
          return;
        }
        // else just continuee with valid anonymous submission
      } catch (error) {
        ERROR_SPAN.innerText = error.message;
        ERROR_SPAN.hidden = false;
      } finally {
        /* ------------------------ Cleanup ----------------------------------- */
        // Use Timeout so Message does not get deleted before User can read it
        setTimeout(() => {
          content_field.setCustomValidity("");
          explanation_field.setCustomValidity("");
          return;
        }, 5000);
      }
    }
  );
}

/** Handles checking and reporting the validity of textareas, since they do not get checked by HTML like Input Elements.
 * @param textarea_to_check {HTMLTextAreaElement}
 * @param valid_pattern {RegExp}
 * @param form_to_be_submitted {HTMLFormElement}
 * @param custom_validity_message {string}
 * @returns {boolean} the status of the validity
 */
function handle_validity_check(
  textarea_to_check,
  valid_pattern,
  form_to_be_submitted,
  custom_validity_message,
) {
  if (!valid_pattern.test(textarea_to_check.value)) {
    textarea_to_check.setCustomValidity(custom_validity_message);
  }
  return form_to_be_submitted.reportValidity();
}

export { get_submit_joke_handler };
