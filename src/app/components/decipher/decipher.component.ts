import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CipherService } from 'src/app/services/cipher.service';

@Component({
    selector: 'app-decipher',
    templateUrl: './decipher.component.html',
    styleUrls: ['./decipher.component.scss']
})
export class DecipherComponent implements OnInit {
    public decipherForm: FormGroup = new FormGroup({});
    
    constructor(
        private cipherService: CipherService,
        private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.decipherForm = this.fb.group({
            sourceText: [''],
            targetText: [''],
            kValue: [null]
        });

        // Every change on the source textbox will trigger a cipher operation
        // and write the result into the target textbox.
        this.decipherForm.get('sourceText')?.valueChanges.subscribe(val => {
            // Get K Value from the form.
            const kValue = this.decipherForm.get("kValue")?.value ?? 0;
            // Retrieve ciphertext from the service.
            const cipherText = this.cipherService.cipher(val, kValue);
            // Set the target textbox.
            this.decipherForm.get('targetText')?.setValue(cipherText);
        });
    }
}
