export const VALIDATION_PATTERNS = {
  FULLNAME: /^[a-zA-Z]+(?:[-\s]?[-\s]?[a-zA-Z]+[-\s]?[-\s]?)*[a-zA-Z]+$/,
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[-_=+@$!%*#?&,.])[A-Za-z\d-@_=+$!%*#?&,.]{8,60}$/,
};
