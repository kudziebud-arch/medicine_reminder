const reminderForm = document.getElementById("reminderForm");
const reminderList = document.getElementById("reminderList");
const alertSound = document.getElementById("alertSound");

// Request Notification permission
if ("Notification" in window) {
  Notification.requestPermission();
}

// Register Service Worker for offline use
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// Store reminders
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

// Display stored reminders on load
reminders.forEach(displayReminder);

reminderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("medicineName").value;
  const time = document.getElementById("reminderTime").value;
  const dosage = document.getElementById("dosage").value;

  const reminder = { name, time, dosage };
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));

  displayReminder(reminder);
  reminderForm.reset();
});

function displayReminder(reminder) {
  const reminderItem = document.createElement("li");
  reminderItem.innerHTML = `
    <span>${reminder.name}</span> - ${reminder.dosage} at ${reminder.time}
    <button class="delete-btn">Delete</button>
  `;

  reminderItem.querySelector(".delete-btn").addEventListener("click", function () {
    reminderList.removeChild(reminderItem);
    reminders = reminders.filter(r => !(r.name === reminder.name && r.time === reminder.time));
    localStorage.setItem("reminders", JSON.stringify(reminders));
  });

  reminderList.appendChild(reminderItem);
}

// Check every minute for reminders
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5);

  reminders.forEach(reminder => {
    if (reminder.time === currentTime) {
      triggerAlert(reminder);
    }
  });
}, 60000);

function triggerAlert(reminder) {
  alertSound.play();

  if (Notification.permission === "granted") {
    new Notification("💊 Time to take your medicine!", {
      body: `${reminder.name} - ${reminder.dosage}`,
      icon: "icon.png"
    });
  } else {
    alert(`💊 Reminder: Take ${reminder.name} - ${reminder.dosage}`);
  }
}
