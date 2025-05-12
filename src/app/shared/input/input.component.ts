import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  standalone: false
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = 'This field is required';
  @Input() formControl: FormControl = new FormControl(); // Allow external FormControl

  inputControl: FormControl = new FormControl(); // Internal FormControl

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    // If an external FormControl is provided, use it; otherwise, use the internal one
    if (this.formControl) {
      this.inputControl = this.formControl;
    } else {
      this.inputControl = new FormControl('', this.required ? Validators.required : []);
    }
  }

  get showError(): boolean {
    return this.inputControl.invalid && this.inputControl.touched;
  }

  writeValue(value: any): void {
    this.inputControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.inputControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.inputControl.disable() : this.inputControl.enable();
  }
}
