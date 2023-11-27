import { stopPropagation } from './script.js';
const refsReserveTickets = {
  openModalBtn: document.querySelector('[data-tickets-modal-open]'),
  closeModalBtn: document.querySelector('[data-tickets-modal-close]'),
  modal: document.querySelector('[data-tickets-modal]'),
  form: document.querySelector('.tickets-form'),
};

const ticketsFormSelector = '#ticketsForm';
const nameFieldSelector = '#nameTickets';
const emailFieldSelector = '#emailTickets';
const countryFieldSelector = '#contrySelect'

const validationTickets = new JustValidate(ticketsFormSelector);

validationTickets
  .addField(nameFieldSelector, [
    { rule: 'required', errorMessage: 'Please enter your name' },
    {
      rule: 'minLength',
      value: 4,
      errorMessage: 'Name should have a minimum of 4 characters',
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
  .addField(
    countryFieldSelector,
    [
      {
        rule: 'required',
        errorMessage: 'Please chose the country',
      },
    ],
    {
      tooltip: {
        position: 'right',
      },
    },
  )

  .onFail(() => {
    addErrorClasses();
  });

registerEventListeners();

function registerEventListeners() {
  refsReserveTickets.openModalBtn.addEventListener('click', toggleTicketsModal);
  refsReserveTickets.closeModalBtn.addEventListener('click', handleModalClose);
  refsReserveTickets.modal.addEventListener('click', toggleTicketsModal);
  refsReserveTickets.form.addEventListener('click', stopPropagation);
  refsReserveTickets.form.addEventListener('submit', sendForm);
  refsReserveTickets.form.addEventListener('input', handleInput);
}

function toggleTicketsModal() {
  document.body.classList.toggle('modal-open');
  refsReserveTickets.modal.classList.toggle('backdrop--hidden');
  resetTicketsForm();
}

function handleModalClose(e) {
  e.stopPropagation();
  toggleTicketsModal();
  resetTicketsForm();
}

function resetTicketsForm() {
  refsReserveTickets.form.reset();
  validationTickets.refresh();
  resetTicketsFormStyles();
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
    name: form.querySelector(nameFieldSelector).value,
    email: form.querySelector(emailFieldSelector).value,
    country: form.querySelector(countryFieldSelector).value,
  };
}

function sendForm(e) {
  e.preventDefault();
  const formData = getFormData(refsReserveTickets.form);
  if (
    Object.values(formData).every(value => value !== '' && value !== undefined)
  ) {
    console.log('formData : ', formData);
    validationTickets.refresh();
    refsReserveTickets.form.reset();
    handleModalClose(e);
  } else {
    console.log('Data in form is not valid');
  }
}

function addErrorClasses() {
  const labels = refsReserveTickets.form.querySelectorAll('div.form__field');
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

function resetTicketsFormStyles() {
  const icons = refsReserveTickets.form.querySelectorAll(
    '.tickest-form__input-icon',
  );
  const labels = refsReserveTickets.form.querySelectorAll('.form__label');
  icons.forEach(item => item.classList.remove('error'));
  labels.forEach(item => item.classList.remove('error'));
}

