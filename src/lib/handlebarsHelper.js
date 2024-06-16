let written = false;

export const handlebarsHelpers = {
  checkIfExists: (options) => {
    if (!written) {
      written = true;
      return options.fn();
    }
  },
  blockTriggeredToFalse: (options) => {
    written = false;
  },
};
