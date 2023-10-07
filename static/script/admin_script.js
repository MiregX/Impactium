function ctaADD() {
  event.preventDefault(); // Отменить стандартное поведение формы
  const eventInput = document.getElementById('eventInput').value;
  const timeInput = document.getElementById('timeInput').value;
  const dateInput = document.getElementById('dateInput').value;
  const descriptionInput = document.getElementById('descriptionInput').value;

  // Проверка формата времени
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(timeInput)) {
    console.error('Неправильный формат времени');
    return;
  }

  // Проверка и преобразование формата даты
  const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
  if (!dateRegex.test(dateInput)) {
    console.error('Неправильный формат даты');
    return;
  }

  const dateParts = dateInput.split('.');
  const day = dateParts[0];
  const month = dateParts[1];
  const year = dateParts[2];

  const formattedDate = `${day}.${month}.${year}`;

  // Проверяем, выбран ли чекбокс
  const checkBoxInput = document.getElementById('checkBoxInput');
  const visibility = checkBoxInput.checked ? 'alliance' : 'members';

  const data = {
    event: eventInput,
    time: timeInput,
    description: descriptionInput,
    visibility: visibility,
    date: formattedDate
  };

  fetch('/admin/cta/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Ошибка при добавлении в ctaList');
      }
    })
    .then(responseData => {
      const existingDateBlock = document.querySelector(`.cta-date[data-date="${responseData.date}"]`);

      if (existingDateBlock) {
        const eventElement = createEventElement(responseData);
        const itemsWrapper = existingDateBlock.parentNode;

        itemsWrapper.appendChild(eventElement);
      } else {
        const dateWrapper = createDateWrapper(responseData);
        const ctaList = document.querySelector('.forSlider');
        const dateElements = Array.from(ctaList.querySelectorAll('.cta-list-unique-date'));

        const insertIndex = findInsertIndex(dateElements, responseData.date);

        if (insertIndex === dateElements.length) {
          ctaList.appendChild(dateWrapper);
        } else {
          ctaList.insertBefore(dateWrapper, dateElements[insertIndex]);
        }
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

function findInsertIndex(elements, value) {
  let insertIndex = elements.length;
  for (let i = 0; i < elements.length; i++) {
    const elementDate = elements[i].querySelector('.cta-date').getAttribute('data-date');
    if (elementDate < value) {
      insertIndex = i;
      break;
    }
  }
  return insertIndex;
}

function createDateWrapper(responseData) {
  const dateWrapper = document.createElement('div');
  dateWrapper.classList.add('cta-list-unique-date');
  const eventElement = createEventElement(responseData);

  dateWrapper.innerHTML = `
    <div class="cta-date" data-date="${responseData.date}">${responseData.date}</div>
    ${eventElement.outerHTML}
  `;
  return dateWrapper;
}

function createEventElement(responseData) {
  const eventElement = document.createElement('div');
  eventElement.classList.add('cta-item-wrapper');
  eventElement.setAttribute('data-time', responseData.time);
  eventElement.setAttribute('data-event', responseData.event);
  eventElement.innerHTML = `
    <div class="cta-item-date">${responseData.time}</div>
    <div class="cta-item-event">${responseData.event}</div>
    <div class="cta-item-count">Players: ${responseData.players_roles.length}</div>
    <img class="cta-item-img" src="https://impactium.fun/static/img/albion/cancel.png" onclick="deleteCTA('${responseData.date}', '${responseData.time}', '${responseData.event}')">
  `;
  return eventElement;
}

function deleteCTA(date, time, event) {
  const data = {
    date: date,
    time: time,
    event: event
  };

  fetch('/admin/cta/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      const ctaListUniqueDate = document.querySelector(`.cta-list-unique-date .cta-date[data-date="${date}"]`);

      if (ctaListUniqueDate) {
        const ctaItemWrappers = ctaListUniqueDate.parentNode.querySelectorAll('.cta-item-wrapper');

        for (let i = 0; i < ctaItemWrappers.length; i++) {
          const ctaItemWrapper = ctaItemWrappers[i];
          if (
            ctaItemWrapper.querySelector('.cta-item-date').dataset.time === time &&
            ctaItemWrapper.querySelector('.cta-item-event').dataset.event === event
          ) {
            ctaItemWrapper.remove();

            const remainingItems = ctaListUniqueDate.parentNode.querySelectorAll('.cta-item-wrapper');
            if (remainingItems.length === 0) {
              // Удаляем принадлежащий cta-list-unique-date
              const ctaListUniqueDateWrapper = ctaListUniqueDate.parentNode;
              ctaListUniqueDateWrapper.remove();
            }

            break;
          }
        }
      }
    } else {
      console.error('Ошибка:', response.status);
    }
  })
  .catch(error => {
    // Обработка ошибок при выполнении запроса
    console.error('Ошибка:', error);
  });
}