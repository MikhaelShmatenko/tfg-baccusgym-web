import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact-service';
import { UserMessage } from '../../interfaces/user-message';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      second_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      text: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    const messageData: UserMessage = {
      name: this.contactForm.value.name,
      second_name: this.contactForm.value.second_name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      text: this.contactForm.value.text,
    };

    this.contactService.sendMessage(messageData).subscribe({
      next: () => {
        this.successMessage =
          'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.';
        this.contactForm.reset();
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error al enviar el mensaje. Inténtalo más tarde.';
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
