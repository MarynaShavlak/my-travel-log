const registrationFormSelector = '#registrationForm';
const usernameFieldSelector = '#username';
const emailFieldSelector = '#email';
const passwordFieldSelector = '#password';
const regFormSelector = '.reg-form';

const validationReg = new JustValidate(registrationFormSelector);

validationReg
  .addField(usernameFieldSelector, [
    { rule: 'required', errorMessage: 'Please enter your username' },
    {
      rule: 'minLength',
      value: 4,
      errorMessage: 'Username should have a minimum of 4 characters',
    },
    {
      rule: 'customRegexp',
      value: /^[a-zA-Z0-9]+$/,
      errorMessage: 'Only letters (a-z or A-Z) and digits (0-9) are allowed',
    },
  ])
  .addField(emailFieldSelector, [
    { rule: 'required', errorMessage: 'Please enter your email' },
    { rule: 'email', errorMessage: 'Please enter a valid email address' },
  ])
  .addField(passwordFieldSelector, [
    { rule: 'required', errorMessage: 'Please enter your password' },
    { rule: 'strongPassword' },
  ])
  .onFail(() => {
    addErrorClasses();
  });

const regForm = document.querySelector(regFormSelector);
regForm.addEventListener('submit', sendForm);
regForm.addEventListener('input', handleInput);
const regErrorInputs = regForm.querySelectorAll('input');

function handleInput(e) {
  const { target } = e;
  const input = target;
  const label = input.parentNode;
  const labelChild = label.querySelector('label');
  const iChild = label.querySelector('i');
  const isError = input.classList.contains('just-validate-error-field');
  const isSuccess = input.classList.contains('just-validate-success-field');

  if (!isError || isSuccess) {
    removeErrorClasses(labelChild, iChild);
  }
}

function getFormData(form) {
  return {
    username: form.querySelector(usernameFieldSelector).value,
    email: form.querySelector(emailFieldSelector).value,
    password: form.querySelector(passwordFieldSelector).value,
  };
}

function sendForm(e) {
  e.preventDefault();
  const regForm = document.querySelector(regFormSelector);
  const formData = getFormData(regForm);
  if (
    Object.values(formData).every(value => value !== '' && value !== undefined)
  ) {
    console.log('formData : ', formData);
    validationReg.refresh();
    regForm.reset();
  } else {
    console.log('Data in form is not valid');
  }
}

function addErrorClasses() {
  const labels = regForm.querySelectorAll('div.form__field');
  labels.forEach(label => {
    const errorChild = label.querySelector('.just-validate-error-label');
    if (errorChild) {
      const labelChild = label.querySelector('label');
      const iChild = label.querySelector('i');
      if (labelChild && iChild) {
        labelChild.classList.add('error');
        iChild.classList.add('error');
      }
    }
  });
}

function removeErrorClasses(labelChild, iChild)  {
  if (labelChild && iChild) {
    labelChild.classList.remove('error');
    iChild.classList.remove('error');
  }
};


