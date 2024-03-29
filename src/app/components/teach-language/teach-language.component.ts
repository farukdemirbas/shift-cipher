import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounce, finalize, timer } from 'rxjs';
import { CipherService } from 'src/app/services/cipher.service';

@Component({
    selector: 'app-teach-language',
    templateUrl: './teach-language.component.html',
    styleUrls: ['./teach-language.component.scss']
})
export class TeachLanguageComponent implements OnInit {
    public teachForm: FormGroup = new FormGroup({});
    public isCalculating = false;

    constructor(
        private cipherService: CipherService,
        private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.teachForm = this.fb.group({
            sourceText: [''],
            freqMapText: [''],
        });

        // Every change on the source textbox will trigger a cipher operation
        // and write the result into the target textbox.
        this.teachForm.get('sourceText')?.valueChanges.pipe(
            finalize(() => this.isCalculating = false),
            debounce(() => timer(200)),
        ).subscribe(txt => {
            const freqMap = this.cipherService.freqAnalysis(txt);
            this.cipherService.setReferenceFreqMap(freqMap);
            const freqMapString = this.cipherService.freqMapStringify(freqMap);
            this.teachForm.get('freqMapText')?.setValue(freqMapString);
        });
    }
}
