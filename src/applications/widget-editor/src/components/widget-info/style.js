export const InputStyles = {
  container: () => ({
    position: "relative",
    boxSizing: "border-box",
    cursor: "pointer",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    backgroundColor: "rgba(255,255,255,0)",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided, state) => {
    return {
      color: "#c32d7b",
      transition: "all 0.2s ease-out",
    };
  },

  indicatorsContainer: () => ({
    color: "#c32d7b",
    display: "flex",
    padding: "8px",
    transition: "color 150ms",
    boxSizing: "border-box",
    position: "relative",
    top: "5px",
  }),

  control: () => ({
    display: "flex",
    border: "none",
    borderRadius: "4px",
    padding: "3px 0",
  }),
};
