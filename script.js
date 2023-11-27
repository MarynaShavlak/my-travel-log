const refsSignUp = {
  openModalBtn: document.querySelector('[data-signin-modal-open]'),
  closeModalBtn: document.querySelector('[data-signin-modal-close]'),
  modal: document.querySelector('[data-signin-modal]'),
  form: document.querySelector('.reg-form'),
};

const registrationFormSelector = '#registrationForm';
const usernameFieldSelector = '#username';
const emailFieldSelector = '#email';
const passwordFieldSelector = '#password';

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

registerEventListeners();

function registerEventListeners() {
  refsSignUp.openModalBtn.addEventListener('click', toggleRegModal);
  refsSignUp.closeModalBtn.addEventListener('click', handleModalClose);
  refsSignUp.modal.addEventListener('click', toggleRegModal);
  refsSignUp.form.addEventListener('click', stopPropagation);
  refsSignUp.form.addEventListener('submit', sendForm);
  refsSignUp.form.addEventListener('input', handleInput);
}

function toggleRegModal() {
  document.body.classList.toggle('modal-open');
  refsSignUp.modal.classList.toggle('backdrop--hidden');
  resetRegForm();
}

function handleModalClose(e) {
  e.stopPropagation();
  toggleRegModal();
  resetRegForm();
}

function resetRegForm() {
  refsSignUp.form.reset();
  validationReg.refresh();
  resetRegFormStyles();
}

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
  const formData = getFormData(refsSignUp.form);
  if (
    Object.values(formData).every(value => value !== '' && value !== undefined)
  ) {
    console.log('formData : ', formData);
    validationReg.refresh();
    refsSignUp.form.reset();
    handleModalClose(e);
  } else {
    console.log('Data in form is not valid');
  }
}

function addErrorClasses() {
  const labels = refsSignUp.form.querySelectorAll('div.form__field');
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

function removeErrorClasses(labelChild, iChild) {
  if (labelChild && iChild) {
    labelChild.classList.remove('error');
    iChild.classList.remove('error');
  }
}

function resetRegFormStyles() {
  const icons = refsSignUp.form.querySelectorAll('.reg-form__input-icon');
  const labels = refsSignUp.form.querySelectorAll('.form__label');
  icons.forEach(item => item.classList.remove('error'));
  labels.forEach(item => item.classList.remove('error'));
}

export function stopPropagation(e) {
  e.stopPropagation();
}
