function isEmpty(value) {
    return !value || value.trim() === '';
}

function userCredentialsAreValid(email, password) {
    return  email &&
        email.includes("@") &&
        password &&
        password.trim().length >= 6;
}


function userDetailAreValid(email, password, name, street, postal, city) {
  return (
    // email &&
    // email.includes("@") &&
    // password &&
    // password.trim().length() >= 6 
    userCredentialsAreValid(email, password) &&
    // name &&
    // name.trim() !== ''
    !isEmpty(name) && !isEmpty(street) && !isEmpty(postal) && !isEmpty(city)
  );
}

function emailIsConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

module.exports = {
    userDetailAreValid: userDetailAreValid,
    emailIsConfirmed: emailIsConfirmed,
};