import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChildActivationStart } from '@angular/router';
import { Workbook } from 'exceljs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import * as fs from 'file-saver';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  userForm!: FormGroup;

  constructor(public fb: FormBuilder, public userService: UserService) {

    this.userForm = this.fb.group({
      firstName: ['', {
        validators: [Validators.required],
      },],
      lastName: ['', {
        validators: [Validators.required],
      },],
      birthday: '',
      TZ: ['', {
        validators: [Validators.required],
      },],
      gender: '',
      HMO: '',
      children: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.userForm.valueChanges.subscribe(res => {
      this.userService.setUser(this.userForm.value);
    })

    var user = this.userService.getUser();
    if (user) {
      this.userForm.patchValue(user);
      user.children.forEach(u => {
        this.children().push(this.newChild(u));
      })
    }
  }

  children(): FormArray {
    return this.userForm.get("children") as FormArray
  }

  newChild(child?: User): FormGroup {
    if (child) {
      return this.fb.group({
        firstName: [child.firstName, {
          validators: [Validators.required, Validators.minLength(2)],
        },],
        birthday: child.birthday,
        TZ: [child.TZ, {
          validators: [Validators.required, Validators.minLength(9)],
        },],
        gender: child.gender,
      })
    }
    return this.fb.group({
      firstName: ['', {
        validators: [Validators.required, Validators.minLength(2)],
      },],
      birthday: '',
      TZ: ['', {
        validators: [Validators.required, Validators.minLength(9)],
      },],
      gender: '',
    })
  }

  addChild() {
    this.children().push(this.newChild());
  }

  removeChild(i: number) {
    this.children().removeAt(i);
  }

  onSubmit() {
    console.log(this.userForm.value);
    this.userService.addUser(this.userForm.value).subscribe(res => {
      this.exportexcel();
    }, er => {
      alert("err: " + er);
    })
  }

  exportexcel(): void {

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Info');

    worksheet.columns = [
      { header: 'FirstName', key: 'firstName', width: 32 },
      { header: 'LastName', key: 'lastName', width: 32 },
      { header: 'TZ', key: 'TZ', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'HMO', key: 'hmo', width: 10 },
    ];

    var user = this.userService.getUser();

    worksheet.addRow([user?.firstName, user?.lastName, user?.TZ, user?.gender, user?.HMO], 'n');
    user?.children?.forEach(e => {
      worksheet.addRow([e.firstName, user?.lastName, e.TZ, e.gender, user?.HMO], 'n');

    })

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'InfoData.xlsx');
    })

  }


}
