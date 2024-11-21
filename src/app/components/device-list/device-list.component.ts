import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Device } from 'src/app/models/device';
import { DeviceService } from 'src/app/services/device.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  deviceList: Device[] = [];
  deviceForm: FormGroup;
  @Input() id2: string;
  @Input() name2: string;
  @Input() price2: number;
  @Input() color2: string;
  @ViewChild('see') see: TemplateRef<any>;

  constructor(
    private deviceService: DeviceService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Añadir validación para precio
      color: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getAll();
  }

  // Obtener todos los dispositivos
  getAll() {
    this.deviceService.getAll().subscribe(
      response => {
        this.deviceList = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  // Guardar un nuevo dispositivo
  save() {
    if (this.deviceForm.invalid) return;

    const device = new Device();
    device.name = this.deviceForm.value.name;
    device.data = { price: this.deviceForm.value.price, color: this.deviceForm.value.color };
    
    this.deviceService.save(device).subscribe(
      response => {
        this.deviceList.push(response); // Agregar el dispositivo a la lista
        this.deviceForm.reset(); // Limpiar el formulario
      },
      error => {
        console.log(error);
      }
    );
  }

  // Eliminar un dispositivo
  delete(id: string) {
    this.deviceService.delete(id).subscribe(() => {
      this.deviceList = this.deviceList.filter(device => device.id !== id);
    });
  }

  // Ver y editar un dispositivo
  view(see: TemplateRef<any>, device: Device) {
    // Asignar los valores del dispositivo para editar
    this.id2 = device.id;
    this.name2 = device.name;
    this.price2 = device.data.price;
    this.color2 = device.data.color;

    // Abrir el modal usando el TemplateRef
    const modalRef: NgbModalRef = this.modalService.open(see);

    // Acción cuando se confirma el modal
    modalRef.result.then(() => {
      device.name = this.name2;
      device.data = { price: this.price2, color: this.color2 };

      this.deviceService.update(device).subscribe(
        response => {
          const index = this.deviceList.findIndex(d => d.id === response.id);
          if (index !== -1) {
            this.deviceList[index] = response; // Actualizar el dispositivo en la lista
          }
        },
        error => {
          console.log(error);
        }
      );
    }).catch(() => {
      // Manejar el caso de cierre sin confirmar (si es necesario)
    });
  }

  // Método de rendimiento para trackBy
  trackById(index: number, device: Device): string {
    return device.id;
  }
}
