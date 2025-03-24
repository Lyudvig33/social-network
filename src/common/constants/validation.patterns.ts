export const VALIDATION_PATTERNS = {
  NAME: /^[a-zA-Z]+(?:[-\s]?[-\s]?[a-zA-Z]+[-\s]?[-\s]?)*[a-zA-Z]+$/,
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[-_=+@$!%*#?&,.])[A-Za-z\d-@_=+$!%*#?&,.]{8,60}$/,
  LAST_NAME: /^[a-zA-Z]+(?:[-\s]?[-\s]?[a-zA-Z]+[-\s]?[-\s]?)*[a-zA-Z]+$/,
};
