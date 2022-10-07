document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll("label.uk-form-label").forEach((label) => {
    if (label.getAttribute("showValue") != "true") {
      return;
    }
    const targetInput = document.querySelector("#" + label.getAttribute("for"));
    const origText = label.innerText;
    const unit = targetInput.getAttribute("unit");

    const updateLabel = () => {
      label.innerText = `${origText} (${
        targetInput.value + (unit ? unit : "")
      })`;
    };

    targetInput.addEventListener("input", () => {
      updateLabel();
    });

    targetInput.addEventListener("change", () => {
      updateLabel();
    });

    const closestForm = label.closest("form");
    console.log("closestForm", closestForm);
    if (closestForm) {
      closestForm.addEventListener("reset", () => {
        updateLabel();
      });
    }

    updateLabel();
  });
});
