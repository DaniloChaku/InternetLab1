const OPERATION_ADD = 0;
const OPERATION_SUBTRACT = 1;
const OPERATION_MULTIPLY = 2;

let max_value = 10;
let operand1 = 0,
  operand2 = 0,
  input = '';
let sign = '+',
  flag = OPERATION_ADD;

const form = document.forms['test'];

function set_sign(x) {
  if (x === '+') {
    flag = 0;
    sign = '+';
  } else if (x === '-') {
    flag = 1;
    sign = '-';
  } else if (x === '*') {
    flag = 2;
    sign = '*';
  }
}

function f_operand() {
  return Math.floor(Math.random() * max_value);
}

function s_operand() {
  if (flag === 0) {
    return Math.floor(
      Math.random() * (max_value - operand1)
    );
  } else if (flag === 1) {
    return Math.floor(Math.random() * operand1);
  } else if (flag === 2) {
    return (
      Math.floor(Math.random() * (max_value / operand1)) ||
      1
    );
  }
  return 0;
}

function input_sign(x) {
  if (x == 10) {
    // Enter key
    const userAnswer = parseInt(input, 10);
    let correctAnswer;

    switch (flag) {
      case OPERATION_ADD:
        correctAnswer = operand1 + operand2;
        break;
      case OPERATION_SUBTRACT:
        correctAnswer = operand1 - operand2;
        break;
      case OPERATION_MULTIPLY:
        correctAnswer = operand1 * operand2;
        break;
    }

    if (userAnswer === correctAnswer) {
      form.r0.value = 'Вірно!';
    } else {
      form.r0.value = 'Спробуй ще!';
      input = '';
      form.result.value = '';
    }

    return;
  }

  input += x;
  form.result.value = input;
}

function main_calc() {
  operand1 = f_operand();
  operand2 = s_operand();

  form.op1.value = operand1;
  form.op2.value = operand2;
  form.s_sign.value = sign;
  input = '';
  form.result.value = '';
  form.r0.value = '???';

  return true;
}

main_calc();
