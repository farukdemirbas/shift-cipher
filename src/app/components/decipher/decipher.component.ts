import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, debounce, timer } from 'rxjs';
import { CipherService } from 'src/app/services/cipher.service';

@Component({
    selector: 'app-decipher',
    templateUrl: './decipher.component.html',
    styleUrls: ['./decipher.component.scss']
})
export class DecipherComponent implements OnInit {
    public decipherForm: FormGroup = new FormGroup({});
    public isCalculating = false;

    constructor(
        private cipherService: CipherService,
        private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.decipherForm = this.fb.group({
            sourceText: [''],
            targetText: [''],
        });

        this.decipherForm.get('sourceText')?.valueChanges.pipe(
            finalize(() => this.isCalculating = false),
            debounce(() => timer(200)),
        ).subscribe(txt => {
            const result = this.cipherService.decipher(txt);
            this.decipherForm.get('targetText')?.setValue(result);
        });
    }

    public get referenceFreqMapExists(): boolean {
        return this.cipherService.getReferenceFreqMap().size > 0;
    }

}
