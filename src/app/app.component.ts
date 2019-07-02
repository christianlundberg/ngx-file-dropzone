import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxFileDropzone } from 'projects/ngx-file-dropzone/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    form: FormGroup;

    @ViewChild(NgxFileDropzone, { static: false }) dropzone: NgxFileDropzone;

    constructor(formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            files: [[]],
        });

        this.form.valueChanges.subscribe(console.log);
    }

    browse() {
        this.dropzone.browse();
    }
}
