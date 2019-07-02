import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectorRef,
    Directive,
    forwardRef,
    HostBinding,
    HostListener,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgxFileDropzoneOptions } from './models';

@Directive({
    selector: '[ngx-file-dropzone]',
    exportAs: 'ngxFileDropzone',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxFileDropzone),
            multi: true,
        },
    ],
})
export class NgxFileDropzone
    implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() options: NgxFileDropzoneOptions;

    @Input() accept: string;

    @Input() set multiple(multiple: boolean) {
        const value: boolean | string = multiple as boolean | string;
        this._multiple =
            value === true || value === 'true' || value === '' ? true : false;
    }

    get multiple(): boolean {
        return this._multiple;
    }

    @HostBinding('class') className: string = 'ngx-file-dropzone';

    @HostBinding('class.disabled') isDisabled: boolean = false;

    @HostBinding('class.active') get isActive(): boolean {
        return this._isActive && !this.isDisabled;
    }

    value: File | File[];

    private document: Document;

    private _multiple: boolean = false;

    private fileInput: HTMLInputElement;

    private listener: Function;

    private _isActive: boolean = false;

    private target: HTMLElement;

    private onChange: Function;

    private onTouched: Function;

    private get shouldTraverse(): boolean {
        const options = this.options;

        return options && options.traverse;
    }

    private get shouldReplace(): boolean {
        const options = this.options;

        return options && options.replace;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(DOCUMENT) document: any,
        private renderer: Renderer2,
        private cdr: ChangeDetectorRef
    ) {
        this.document = document;
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.appendFileInput();
    }

    ngOnDestroy() {
        if (this.fileInput)
            this.renderer.removeChild(this.document.body, this.fileInput);
        if (this.listener) this.listener();
    }

    @HostListener('dragenter', ['$event.target'])
    onDragEnter(target: HTMLElement): void {
        this.target = target;
        this._isActive = true;
    }

    @HostListener('dragleave', ['$event.target'])
    onDragLeave(target: HTMLElement): void {
        if (this.target == target) this._isActive = false;
    }

    @HostListener('dragover', ['$event'])
    onDragOver(e: DragEvent): void {
        e.preventDefault();
    }

    @HostListener('drop', ['$event', '$event.dataTransfer'])
    onDrop(e: Event, dataTransfer: DataTransfer): void {
        e.preventDefault();
        this._isActive = false;

        if (this.isDisabled) return;

        let files: File[] = [];

        const itemList = dataTransfer.items;

        const fileList = dataTransfer.files;

        if (itemList) {
            files = Array.from(itemList)
                .filter(item => item.kind === 'file')
                .map(item => item.getAsFile());
        } else {
            files = Array.from(fileList);
        }

        this.setValueAndUpdate(files);
    }

    browse(): void {
        if (this.isDisabled || !this.fileInput) return;

        this.fileInput.click();
    }

    writeValue(value: File | File[]): void {
        this.value = value;
    }

    registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    private setValue(newFiles: File[]): void {
        if (this.multiple) {
            const prevFiles = this.value;
            const value = Array.isArray(prevFiles) ? prevFiles : [];
            this.value = this.shouldReplace
                ? newFiles
                : [...value, ...newFiles];
        } else {
            const file = newFiles[0];
            this.value = file ? file : null;
        }
    }

    private setValueAndUpdate(files: File[]): void {
        this.setValue(files);

        if (this.onTouched) this.onTouched();
        if (this.onChange) this.onChange(this.value);
    }

    private appendFileInput(): void {
        this.fileInput = this.createFileInput();
        this.renderer.appendChild(this.document.body, this.fileInput);
        this.listener = this.renderer.listen(
            this.fileInput,
            'change',
            (e: Event) => {
                const fileList: FileList = (e.target as HTMLInputElement).files;
                this.setValueAndUpdate(Array.from(fileList));
                this.cdr.detectChanges();
            }
        );
    }

    private createFileInput(): HTMLInputElement {
        const input = this.renderer.createElement('input');
        this.renderer.setAttribute(input, 'type', 'file');
        this.renderer.setAttribute(input, 'aria-hidden', 'true');
        this.renderer.setProperty(input, 'hidden', true);
        this.renderer.setProperty(input, 'multiple', this.multiple);
        if (this.accept)
            this.renderer.setAttribute(input, 'accept', this.accept);
        return input;
    }
}
