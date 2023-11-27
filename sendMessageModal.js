import { stopPropagation } from './script.js';
const refsSendMessage = {
  openModalBtn: document.querySelector('[data-sendMessage-modal-open]'),
  closeModalBtn: document.querySelector('[data-sendMessage-modal-close]'),
  modal: document.querySelector('[data-sendMessage-modal]'),
  form: document.querySelector('.subscription__form-send'),
};

const sendMessageFormSelector = '#sendMessageForm';
const nameSendFieldSelector = '#nameSend';
const emailSendFieldSelector = '#emailSend';
const commentSendSendSelector = '#commentSend';

const validationSend = new JustValidate(sendMessageFormSelector);

validationSend
  .addField(nameSendFieldSelector, [
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
  .addField(emailSendFieldSelector, [
    { rule: 'required', errorMessage: 'Please enter your email' },
    { rule: 'email', errorMessage: 'Please enter a valid email address' },
  ])
  .addField(commentSendSendSelector, [
    { rule: 'required', errorMessage: 'Please enter your message' },
    {
      rule: 'minLength',
      value: 4,
      errorMessage: 'Message should have a minimum of 4 characters',
    },
  ]);

registerEventListeners();

function registerEventListeners() {
  refsSendMessage.openModalBtn.addEventListener('click', toggleModal);
  refsSendMessage.closeModalBtn.addEventListener('click', handleModalClose);
  refsSendMessage.modal.addEventListener('click', toggleModal);
  refsSendMessage.form.addEventListener('click', stopPropagation);
  refsSendMessage.form.addEventListener('submit', sendMessageForm);
}

function resetSendMessageForm() {
  refsSendMessage.form.reset();
  validationSend.refresh();
}

function toggleModal() {
  document.body.classList.toggle('modal-open');
  refsSendMessage.modal.classList.toggle('backdrop--hidden');
  resetSendMessageForm();
}
function handleModalClose(e) {
  e.stopPropagation();
  toggleModal();
  resetSendMessageForm();
}

function getFormData(form) {
  return {
    name: form.querySelector(nameSendFieldSelector).value,
    email: form.querySelector(emailSendFieldSelector).value,
    message: form.querySelector(commentSendSendSelector).value,
  };
}

function sendMessageForm(e) {
  e.preventDefault();

  const formData = getFormData(refsSendMessage.form);
  if (
    Object.values(formData).every(value => value !== '' && value !== undefined)
  ) {
    console.log('formData : ', formData);
    validationSend.refresh();
    refsSendMessage.form.reset();
    handleModalClose(e);
  } else {
    console.log('Data in form is not valid');
  }
}
