import { FormBuilder } from '@angular/forms';
import { DataService, User } from '../../services/data.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let savedUser: User | undefined;
  let component: RegisterComponent;

  beforeEach(() => {
    savedUser = undefined;
    const data = {
      register: (user: User) => {
        savedUser = user;
        return true;
      }
    } as unknown as DataService;

    component = new RegisterComponent(data, new FormBuilder());
  });

  it('marks the form invalid when passwords do not match', () => {
    component.registerForm.setValue({
      name: 'Maria Perez',
      rut: '12345678-9',
      email: 'maria@correo.cl',
      phone: '+56 9 1234 5678',
      birthDate: '2000-01-01',
      role: 'cliente',
      address: '',
      password: 'Clave123',
      confirmPassword: 'Otra123'
    });

    expect(component.registerForm.valid).toBeFalse();
    expect(component.registerForm.hasError('passwordMismatch')).toBeTrue();
  });

  it('requires the user to be at least 13 years old', () => {
    const nextYear = new Date().getFullYear() + 1;

    const birthDateControl = component.registerForm.get('birthDate');
    birthDateControl?.setValue(`${nextYear}-01-01`);

    expect(birthDateControl?.valid).toBeFalse();
    expect(birthDateControl?.hasError('minimumAge')).toBeTrue();
  });

  it('registers a valid user with optional shipping address empty', () => {
    component.registerForm.setValue({
      name: 'Maria Perez',
      rut: '12345678-9',
      email: 'MARIA@CORREO.CL',
      phone: '+56 9 1234 5678',
      birthDate: '2000-01-01',
      role: 'cliente',
      address: '',
      password: 'Clave123',
      confirmPassword: 'Clave123'
    });

    component.register();

    expect(savedUser?.email).toBe('maria@correo.cl');
    expect(savedUser?.address).toBe('');
    expect(component.success).toBeTrue();
  });
});
