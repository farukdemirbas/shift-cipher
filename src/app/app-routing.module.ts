import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CipherComponent } from './components/cipher/cipher.component';
import { DecipherComponent } from './components/decipher/decipher.component';
import { TeachLanguageComponent } from './components/teach-language/teach-language.component';

const routes: Routes = [
    {
        path: '',
        component: CipherComponent
    },
    {
        path: 'cipher',
        component: CipherComponent
    },
    {
        path: 'reference',
        component: TeachLanguageComponent
    },
    {
        path: 'decipher',
        component: DecipherComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
