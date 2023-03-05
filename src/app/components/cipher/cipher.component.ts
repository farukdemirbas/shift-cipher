import { Component, OnInit } from '@angular/core';
import { CipherService } from 'src/app/services/cipher.service';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-cipher',
    templateUrl: './cipher.component.html',
    styleUrls: ['./cipher.component.scss']
})
export class CipherComponent implements OnInit {

    public cipherForm: FormGroup = new FormGroup({});

    public kValueSettings = { min: -400, max: 400 };

    constructor(
        private cipherService: CipherService,
        private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.cipherForm = this.fb.group({
            sourceText: [''],
            targetText: [''],
            kValue: [-8, [Validators.min(this.kValueSettings.min), Validators.max(this.kValueSettings.max)]]
        });

        // Every change on the source textbox will trigger a cipher operation
        // and write the result into the target textbox.
        this.cipherForm.get('sourceText')?.valueChanges.subscribe(val => {
            // Get K Value from the form.
            const kValue = parseInt(this.cipherForm.get("kValue")?.value) ?? 0;
            // Retrieve ciphertext from the service.
            const cipherText = this.cipherService.cipher(val, kValue);
            // Set the target textbox.
            this.cipherForm.get('targetText')?.setValue(cipherText);
        });

        // Every change in the K Value input field will emit a change event on
        // the source textbox, effectively triggering a cipher operation.
        this.cipherForm.get('kValue')?.valueChanges.subscribe(val => {
            val = parseInt(val);
            if (isNaN(val)) {
                this.cipherForm.get('sourceText')?.updateValueAndValidity({ emitEvent: true });
                return;
            }            
            if (val < this.kValueSettings.min) {
                val = this.kValueSettings.min;
                this.cipherForm.get('kValue')?.setValue(val);
            }
            else if (val > this.kValueSettings.max) {
                val = this.kValueSettings.max;
                this.cipherForm.get('kValue')?.setValue(val);
            };

            this.cipherForm.get('sourceText')?.updateValueAndValidity({ emitEvent: true });
        })
    }
}
