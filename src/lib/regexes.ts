export const PASSWORD_REGEX_1 = /^.{5,}$/
// ^ At least 5 characters
export const PASSWORD_REGEX_2_1 = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/
// ^ At least 5 characters, at least one lowercase and one uppercase
export const PASSWORD_REGEX_2_2 = /^(?=.*[a-z])(?=.*\d).{5,}$/
// ^ At least 5 characters, at least one lowercase and one number
export const PASSWORD_REGEX_3 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
// ^ At least 6 characters, at least one lowercase, one uppercase, and one number
export const PASSWORD_REGEX_4_1 =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/
// ^ At least 6 characters, at least one lowercase, one uppercase, one number, and one symbol
export const PASSWORD_REGEX_4_2 =
  /^(?=(?:.*[a-z]){2})(?=(?:.*[A-Z]){2})(?=(?:.*\d){2}).{7,}$/
// ^ At least 7 characters, at least two lowercase, two uppercase, and two numbers
export const PASSWORD_REGEX_5 =
  /^(?=(?:.*[a-z]){2})(?=(?:.*[A-Z]){2})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])).{8,}$/
// ^ At least 8 characters, at least two lowercase, two uppercase, two numbers, and one symbol
