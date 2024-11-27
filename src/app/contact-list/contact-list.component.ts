import { Component, OnInit } from "@angular/core";
import { ContactService } from "../services/contact.service";
import { Contact } from "../models/contact";

@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.css"],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  // Объект для хранения данных нового или редактируемого контакта
  contact: Contact = {
    name: "",
    email: "",
    phone: {
      mobile: "",
      work: "",
    },
  };

  // Переменная для хранения выбранного контакта для редактирования
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts().subscribe((data: Contact[]) => {
      this.contacts = data;
    });
  }

  deleteContact(id: string): void {
    this.contactService.deleteContact(id).subscribe(() => {
      this.contacts = this.contacts.filter((contact) => contact._id !== id);
    });
  }

  // Метод для отправки формы (создание или обновление контакта)
  onSubmit(): void {
    if (this.selectedContact) {
      // Если контакт выбран, обновляем его
      this.contactService
        .updateContact(this.contact)
        .subscribe((updatedContact) => {
          const index = this.contacts.findIndex(
            (c) => c._id === updatedContact._id
          );
          this.contacts[index] = updatedContact;
          this.clearForm();
        });
    } else {
      // Если контакт не выбран, создаем новый
      this.contactService
        .createContact(this.contact)
        .subscribe((newContact) => {
          this.contacts.push(newContact);
          this.clearForm();
        });
    }
  }

  // Метод для выбора контакта для редактирования
  editContact(contact: Contact): void {
    this.selectedContact = contact;
    this.contact = { ...contact }; // Клонируем данные для редактирования
  }

  // Метод для очистки формы
  clearForm(): void {
    this.selectedContact = null;
    this.contact = { name: "", email: "", phone: { mobile: "", work: "" } };
  }
}
