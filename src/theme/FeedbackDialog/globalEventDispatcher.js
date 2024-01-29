export const openFeedbackModalEventName = "openFeedbackModal";

export function dispatchOpenFeedbackModalEvent() {
    window.dispatchEvent(new CustomEvent(openFeedbackModalEventName));
}
